const AWSXRay = require('aws-xray-sdk');

const awsRegion = process.env.AWS_REGION || "us-east-1";
const options = { region: awsRegion };
const bucketName = process.env.AWS_S3_BUCKET_NAME;

// Capture all AWS clients we create
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const s3 = new AWS.S3(options);

exports.uploadFile = async (object) => {
  const { bucket, phoneNumber, audioId, audioFile, language } = object;
  const key = `${phoneNumber}/${audioId}.ogg`;

  const upload = await s3
    .upload({
      Bucket: bucket ? bucket : bucketName,
      Key: key,
      Body: audioFile,
      Metadata: {
        language: language,
        "phone-number": phoneNumber,
      },
    })
    .promise();

  return upload;
};

exports.getUrl = async (key, bucket) => {
  const url = s3.getSignedUrl("getObject", {
    Bucket: bucket ? bucket : bucketName,
    Key: key,
    Expires: 300,
  });
  
  return url;
};

exports.getTranscription = async (object) => {
  const { from, key, bucket } = object;
  const transcription = await s3
    .getObject({
      Bucket: bucket ? bucket : bucketName,
      Key: `${from}/${key}`,
    })
    .promise();

  return JSON.parse(transcription.Body.toString());
};
