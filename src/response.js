const AWS = require("aws-sdk");
const whatsapp = require("./util/whatsapp");
const storage = require("./util/s3");

const vault = process.env.VAULT;

exports.lambdaHandler = async (event, context) => {
  try {
    const key = event.Records[0].s3.object.key;
    const bucketName = event.Records[0].s3.bucket.name;
    const from = key.split("/")[0];

    console.log(`***RESPONSE from ${from} (audio)***`);

    const url = await storage.getUrl(key, bucketName);

    await whatsapp.sendAudio({
      audioUrl: url,
      sendTo: from
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
