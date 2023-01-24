
const database = require("./util/database");
const setup = require("./util/setup");
const speech = require("./util/polly");
const openai = require("./util/openai");
const storage = require("./util/s3");
const whatsapp = require("./util/whatsapp");

const vault = process.env.VAULT;

exports.lambdaHandler = async (event, context) => {

  let key = event.Records[0].s3.object.key;
  const bucketName = event.Records[0].s3.bucket.name;
  const from = key.split("/")[0];
  key = key.split("/").pop();

  try {

    console.log(`***SPEECHING from ${from} (audio)***`);

    const tableData = await database.readLangItem(from);
    const language = tableData.Item.LangTranslation;
    const { pollyLanguage, pollyVoice } = await setup.languageConfig(language);

    //get audio transcribed from S3
    const transcription = await storage.getTranscription({
      from: from,
      key: key,
      bucket: bucketName
    });

    const transcriptionResult = transcription.results.transcripts[0].transcript

    if (transcriptionResult) {

      await whatsapp.sendMessage({
        body: "Listening, please wait...",
        sendTo: from,
      });

      const openaiResponse = await openai.getOpenAiResponse(transcriptionResult);

      await database.createModelItem({
        key: from,
        message: transcriptionResult,
        response: openaiResponse,
        type: "audio"
      });

      await speech.createSpeech({
        bucketName: bucketName,
        prefix: from,
        text: openaiResponse,
        pollyLanguage: pollyLanguage,
        pollyVoice: pollyVoice,
      });

    } else {
      throw new Error("Text is empty");
    }
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
