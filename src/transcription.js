const setup = require("./util/setup");
const database = require("./util/database");
const transcribe = require("./util/transcribe");

exports.lambdaHandler = async (event, context) => {
  let key = event.Records[0].s3.object.key;
  const bucketName = event.Records[0].s3.bucket.name;
  const from = key.split("/")[0];
  key = key.split("/").pop();
  console.log(`***TRANSCRIBE from ${from} (audio)***`);

  try {
    const tableData = await database.readLangItem(from);

    const language = tableData.Item.LangTranslation;
    const translationMap = await setup.languageConfig(language);

    await transcribe.transcribeAudio({
      bucketName,
      from,
      key,
      ...translationMap,
    });
  } catch (ex) {
    console.error(`
      Error Name: ${ex.name}\n 
      Error Message ${ex.message}\n 
      Error Stack ${ex.stack}`
    );
    return {
      statusCode: ex.statusCode ? ex.statusCode : 500
    };
  }

  return {
    statusCode: 200,
  };
};
