const whatsapp = require("./util/whatsapp");
const database = require("./util/database");
const storage = require("./util/s3");
const openai = require("./util/openai");
const setup = require("./util/setup");

function isEmpty(object) {
  return Object.keys(object).length === 0;
}

exports.lambdaHandler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    let language = "portuguese";

    if (body.entry) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const from = body.entry[0].changes[0].value.messages[0].from;
        const type = body.entry[0].changes[0].value.messages[0].type;
        const messageId = body.entry[0].changes[0].value.messages[0].id;

        const name = body.entry[0].changes[0].value.contacts[0].profile.name;

        if (type === "unsupported") {
          return {
            statusCode: 200,
          };
        }

        console.log(`***RECEIVE from ${from} (${type})***`);

        await whatsapp.readMessage(messageId);

        // check if is the first message from user
        const tableData = await database.readLangItem(from);

          if (isEmpty(tableData)) {
            await database.createLangItem({
              key: from,
              name: name,
              language: language,
            });
          } else {
            language = tableData.Item.LangTranslation;
          }

        if (type == "text") {
          const messageReceived =
            body.entry[0].changes[0].value.messages[0].text.body;

          if (messageReceived.substring(0, 1) === "!") {
            await setup.setupLanguage(messageReceived, from, name);

            return {
              statusCode: 200,
            };
          }

          const openaiResponse = await openai.getOpenAiResponse(
            messageReceived
          );

          await database.createModelItem({
            key: from,
            message: messageReceived,
            response: openaiResponse,
            type: "text",
            name: name,
          });

          await whatsapp.sendMessage({
            body: openaiResponse,
            sendTo: from,
          });

          await whatsapp.sendMessage({
            body: "Hello!\nAproveite a *nova funcionalidade* e envie uma mensagem de *audio*.",
            sendTo: from,
          });
        }

        if (type == "audio") {
          const audioId = body.entry[0].changes[0].value.messages[0].audio.id;
          const audioFile = await whatsapp.processAudioMessage(audioId);

          await storage.uploadFile({
            audioId: audioId,
            audioFile: audioFile,
            language: language,
            phoneNumber: from,
          });
        }

        if (type == "interactive") {
          const interactiveType =
            body.entry[0].changes[0].value.messages[0].interactive.type;
          const messageId =
            body.entry[0].changes[0].value.messages[0].interactive[
              interactiveType
            ].id;

          await setup.setupLanguage(messageId, from);
        }
      }
    }
  } catch (ex) {
    console.error(`
      Error Name: ${ex.name}\n 
      Error Message ${ex.message}\n 
      Error Stack ${ex.stack}`);
    return {
      statusCode: ex.statusCode ? ex.statusCode : 500,
    };
  }

  return {
    statusCode: 200,
  };
};
