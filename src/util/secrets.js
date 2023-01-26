const AWSXRay = require('aws-xray-sdk');

const awsRegion = process.env.AWS_REGION || "us-east-1";
const options = { region: awsRegion };

// Capture all AWS clients we create
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const secretManager = new AWS.SecretsManager(options);

exports.getSecrets = async (vaultName) => {
  const result = await secretManager
    .getSecretValue({ SecretId: vaultName })
    .promise();
  return result;
};
