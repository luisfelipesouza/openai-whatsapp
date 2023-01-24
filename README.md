# openai-whatsapp
## Requirements
* [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* [AWS CLI](https://aws.amazon.com/pt/cli/)
* [Node v14](https://nodejs.org/en/blog/release/v14.17.3/)

## AWS Resources in use
* [AWS Lambda](https://aws.amazon.com/lambda/)
* [Amazon API Gateway](https://aws.amazon.com/api-gateway/)
* [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)
* [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
* [Amazon Transcribe](https://aws.amazon.com/transcribe/)
* [Amazon Polly](https://aws.amazon.com/polly/)
* [Amazon S3](https://aws.amazon.com/s3/)

## Setup AWS CLI
```bash
$ aws cofiguration
```

## Store Whatsapp and OpenAI Secrets
### Create a json file called "secrets.json"
```json
{
    "token": "YOUR TOKEN HERE",
    "phoneNumberId" : "YOUR PHONE NUMBER ID HERE",
    "openaiKey":"YOUR OPENAI KEY HERE",
    "organizationId":"YOUR OPENAI ORG-ID HERE"
}
```
### Run "aws secretsmanager" in order to store the secrets
```bash
$ aws secretsmanager create-secret --name openai-whatsapp  --secret-string file://secrets.json
```

## Deployment
```bash
$ sam build
```
```bash
$ sam deploy --guided
```

## Before deployment
* create a Business App in [Meta for Developers](https://developers.facebook.com)
* get the Access Token and Phone number ID
* create a API Key in [OpenAI Keys](https://beta.openai.com/account/api-keys)
* get the Organization ID in [OpenAI Org](https://beta.openai.com/account/org-settings)

## After deployment
* create a "Whatsapp Business Account" webhook and subscribe for "messages"
* use the Api Gateway Endpoint created by deploy with the path "/whatsapp" as callback URL, e.g.: (https://xxxxx.execute-api.us-east-1.amazonaws.com/Prod/whatsapp)
* use the word "VERIFY" as Verify token for callback URL.