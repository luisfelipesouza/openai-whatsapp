const AWS = require("aws-sdk");
const { uuid } = require('uuidv4');

const awsRegion = process.env.AWS_REGION || "us-east-1";
const tableName = process.env.TABLE_NAME;
const options = { region: awsRegion };

const dynamoDb = new AWS.DynamoDB.DocumentClient(options);

exports.createItem = async (item) => {
  const timestamp = new Date().toISOString();
  return await dynamoDb
    .put({
      TableName: tableName,
      Item: {
        Id: uuid(),
        PhoneNumber: item.key,
        Message: item.message,
        Response: item.response,
        Date: timestamp
      },
    })
    .promise();
};
