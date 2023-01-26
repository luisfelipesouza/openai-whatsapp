const axios = require("axios");
const AWSXRay = require('aws-xray-sdk');
const secrets = require("./secrets");

// Capture Axios requests
AWSXRay.captureHTTPsGlobal(require('http'));
AWSXRay.captureHTTPsGlobal(require('https'));

const facebookUrl = process.env.FACEBOOK_URL;
const vault = process.env.VAULT;
const requestTimeout = 3000;

exports.getSecretsString = async (vault) => {
  const secretValue = await secrets.getSecrets(vault);
  return JSON.parse(secretValue.SecretString);
}

exports.sendMessage = async (message) => {
  const { token, phoneNumberId } = await this.getSecretsString(vault);
  const { sendTo, body } = message;
  const response = await axios({
    method: "POST",
    timeout: requestTimeout,
    url: `${facebookUrl}/${phoneNumberId}/messages/`,
    data: {
      messaging_product: "whatsapp",
      to: sendTo,
      text: {
        body: body,
      },
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};

exports.sendInteractiveMessage = async (sendTo, payload) => {
  const { token, phoneNumberId } = await this.getSecretsString(vault);
  const response = await axios({
    method: "POST",
    timeout: requestTimeout,
    url: `${facebookUrl}/${phoneNumberId}/messages/`,
    data: {
      messaging_product: "whatsapp",
      to: sendTo,
      type: "interactive",
      interactive: payload,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });

  return response;
};

exports.sendAudio = async (option) => {
  const { token, phoneNumberId } = await this.getSecretsString(vault);
  const { sendTo, audioUrl } = option;
  const response = await axios({
    method: "POST",
    timeout: requestTimeout,
    url: `${facebookUrl}/${phoneNumberId}/messages/`,
    data: {
      messaging_product: "whatsapp",
      to: sendTo,
      type: "audio",
      audio: {
        link: audioUrl,
      },
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });

  return response;
};

exports.getAudioUrl = async (audioId) => {
  const { token } = await this.getSecretsString(vault);
  const url = await axios({
    method: "GET",
    timeout: requestTimeout,
    url: `${facebookUrl}/${audioId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });

  return url.data.url;
};

exports.getAudioFile = async (audioUrl) => {
  const { token } = await this.getSecretsString(vault);
  const file = await axios({
    method: "GET",
    timeout: requestTimeout,
    responseType: "arraybuffer",
    url: audioUrl,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });

  return file.data;
};

exports.processAudioMessage = async (audioId) => {
  const audioUrl = await this.getAudioUrl(audioId);
  const audioFile = await this.getAudioFile(audioUrl);

  return audioFile;
};

exports.readMessage = async (messageId) => {
  const { token, phoneNumberId } = await this.getSecretsString(vault);
  const response = await axios({
    method: "POST",
    timeout: requestTimeout,
    url: `${facebookUrl}/${phoneNumberId}/messages/`,
    data: {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
