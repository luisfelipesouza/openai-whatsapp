const AWS = require("aws-sdk");

const awsRegion = process.env.AWS_REGION || "us-east-1";
const options = { region: awsRegion };

const polly = new AWS.Polly(options);

exports.createSpeech = async (item) => {
  const { bucketName, prefix, text, pollyLanguage, pollyVoice } = item;
  await polly
    .startSpeechSynthesisTask({
      OutputFormat: "mp3",
      OutputS3BucketName: bucketName,
      OutputS3KeyPrefix: `${prefix}/`,
      Text: text,
      LanguageCode: pollyLanguage,
      VoiceId: pollyVoice,
    })
    .promise();
};

