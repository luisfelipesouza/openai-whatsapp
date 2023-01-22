const secrets = require("./util/secrets");
const whatsapp = require("./util/whatsapp");
const database = require("./util/database");
const openai = require("./util/openai");

const vault = process.env.VAULT;

exports.lambdaHandler = async (event, context) => {
  try {
    const secretsWhatsapp = await secrets.getSecretsWhatsapp(vault);
    const { token, phoneNumberId, openaiKey, organizationId } = JSON.parse(secretsWhatsapp.SecretString);
    const whatsappOptions = { token: token, phoneNumberId: phoneNumberId };
    const body = JSON.parse(event.body);
    
    if (body.entry) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        let from = body.entry[0].changes[0].value.messages[0].from;
        let type = body.entry[0].changes[0].value.messages[0].type;
        let messageId = body.entry[0].changes[0].value.messages[0].id;

        if (type === "unsupported") {
          return {
            statusCode: 200,
          };
        }

        console.log(`***RECEIVE from ${from} (${type})***`);

        await whatsapp.readMessage({
          ...whatsappOptions,
          messageId: messageId,
        });

        if (type == "text") {
          const messageReceived =
            body.entry[0].changes[0].value.messages[0].text.body;

          const openaiConfig = await openai.configureOpenAi(
            openaiKey,
            organizationId
          );

          const openaiResponse = await openai.getOpenAiResponse(
            openaiConfig,
            messageReceived
          );

          await database.createItem({
            key: from,
            message: messageReceived,
            response: openaiResponse,
          });

          await whatsapp.sendMessage({
            ...whatsappOptions,
            message: openaiResponse,
            sendTo: from,
          });
        }
      }
    }
  } catch (ex) {
    console.error("Error Name \n", ex.name);
    console.error("Error Message \n", ex.message);
    console.error("Error Stack \n", ex.stack);
    return {
      statusCode: 500,
    };
  }

  return {
    statusCode: 200,
  };

};
