const whatsapp = require("./whatsapp");
const database = require("./database");

const languageMap = {
  english: {
    pollyLanguage: "en-US",
    pollyVoice: "Salli",
  },
  portuguese: {
    pollyLanguage: "pt-BR",
    pollyVoice: "Camila",
  },
  french: {
    pollyLanguage: "fr-FR",
    pollyVoice: "Celine",
  },
  spanish: {
    pollyLanguage: "es-ES",
    pollyVoice: "Conchita",
  },
  deutsch: {
    pollyLanguage: "de-DE",
    pollyVoice: "Marlene",
  },
};

exports.languageConfig = async (language) => {
    return languageMap[language]
}

const languagePayload = {
  type: "list",
  body: {
    text: "Choose audio language...",
  },
  action: {
    button: "Available",
    sections: [
      {
        rows: [
          {
            id: "!pt",
            title: "Português",
          },
          {
            id: "!en",
            title: "English",
          },
          {
            id: "!fr",
            title: "Français",
          },
          {
            id: "!de",
            title: "Deutsch",
          },
          {
            id: "!es",
            title: "Spanish",
          },
        ],
      },
    ],
  },
};

exports.setupLanguage = async (message, sendTo) => {

  if (message === "!pt") {
    languageMessage = "Português";

    await database.updateLangItem({
      key: sendTo,
      language: "portuguese",
    });

    await whatsapp.sendMessage({
      body: "Português selecionado...",
      sendTo: sendTo,
    });

    return;
  }

  if (message === "!en") {
    languageMessage = "Inglês";

    await database.updateLangItem({
      key: sendTo,
      language: "english",
    });

    await whatsapp.sendMessage({
      body: "English selected...",
      sendTo: sendTo,
    });

    return;
  }

  if (message === "!es") {
    languageMessage = "Espanhol";

    await database.updateLangItem({
      key: sendTo,
      language: "spanish",
    });

    await whatsapp.sendMessage({
      body: "Español seleccionado...",
      sendTo: sendTo,
    });

    return;
  }

  if (message === "!fr") {
    languageMessage = "Francês";

    await database.updateLangItem({
      key: sendTo,
      language: "french",
    });

    await whatsapp.sendMessage({
      body: "Français sélectionné....",
      sendTo: sendTo,
    });

    return;
  }

  if (message === "!de") {
    languageMessage = "Alemão";

    await database.updateLangItem({
      key: sendTo,
      language: "deutsch",
    });

    await whatsapp.sendMessage({
      body: "Deutsch ausgewählt...",
      sendTo: sendTo,
    });

    return;
  }

  await whatsapp.sendInteractiveMessage(sendTo, languagePayload);

  return;
};
