const AWSXRay = require('aws-xray-sdk');
const { v4: uuidv4 } = require('uuid');

const awsRegion = process.env.AWS_REGION || "us-east-1";
const modelTableName = process.env.MODEL_TABLE_NAME;
const langTableName = process.env.LANG_TABLE_NAME;

// Capture all AWS clients we create
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const options = { region: awsRegion };

const dynamoDb = new AWS.DynamoDB.DocumentClient(options);

exports.createModelItem = async (item) => {
  const { key, message, response, type, name } = item;
  const timestamp = new Date().toISOString();
  return await dynamoDb
    .put({
      TableName: modelTableName,
      Item: {
        Id: uuidv4(),
        PhoneNumber: key,
        Message: message,
        Response: response,
        Type: type,
        Date: timestamp              
      },
    })
    .promise();
};

exports.readLangItem = async (key) => {
  return await dynamoDb.get({
      TableName: langTableName,
      Key: {
          phoneNumber: key
      }
  }).promise();
};

exports.createLangItem = async (item) => {
  const { key, language, name } = item; 
  const timestamp = new Date().toISOString()
  return await dynamoDb.put({
      TableName: langTableName,
      Item: {
          phoneNumber: key,
          Name: name ? name : "?",
          LangTranslation: language,
          CreatedAt: timestamp,
          UpdatedAt: timestamp
      }
  }).promise();
};

exports.updateLangItem = async (item) => {
  const { key, language } = item; 
  const timestamp = new Date().toISOString()
  return await dynamoDb.update({
      TableName: langTableName,
      Key: {
          phoneNumber: key,
      },
      UpdateExpression:
          "SET LangTranslation = :LangTranslation, UpdatedAt = :UpdatedAt" ,
      ConditionExpression: "attribute_exists(phoneNumber)",
      ExpressionAttributeValues: {
          ":LangTranslation": language,
          ":UpdatedAt": timestamp
      }
  }).promise();
};

exports.updateLangTranslate = async (item) => {
  const { key, translate } = item; 
  const timestamp = new Date().toISOString()
  return await dynamoDb.update({
      TableName: langTableName,
      Key: {
          phoneNumber: key,
      },
      UpdateExpression:
          "SET TranslationCode = :TranslationCode, UpdatedAt = :UpdatedAt" ,
      ConditionExpression: "attribute_exists(phoneNumber)",
      ExpressionAttributeValues: {
          ":TranslationCode": translate,
          ":UpdatedAt": timestamp
      }
  }).promise();
};
