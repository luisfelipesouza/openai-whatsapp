const AWS = require("aws-sdk");
const awsRegion = process.env.AWS_REGION || "us-east-1";

const options = { region: awsRegion };
const secretManager = new AWS.SecretsManager(options);

exports.getSecrets = async (vaultName) => {
  const result = await secretManager
    .getSecretValue({ SecretId: vaultName })
    .promise();
  return result;
};
