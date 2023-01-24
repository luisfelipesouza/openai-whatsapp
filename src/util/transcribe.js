const AWS = require("aws-sdk");

const awsRegion = process.env.AWS_REGION || "us-east-1";
const options = { region: awsRegion };

const transcribeService = new AWS.TranscribeService(options);

exports.transcribeAudio = async (object) => {
  const { key, from, bucketName, pollyLanguage } = object;
  await transcribeService
    .startTranscriptionJob({
      TranscriptionJobName: key.split(".")[0],
      LanguageCode: pollyLanguage,
      MediaFormat: "ogg",
      Media: {
        MediaFileUri: `s3://${bucketName}/${from}/${key}`,
      },
      OutputBucketName: bucketName,
      OutputKey: `${from}/`,
    })
    .promise();
};
