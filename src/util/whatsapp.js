const axios = require("axios");

const facebookUrl = process.env.FACEBOOK_URL;
const requestTimeout = 3000;

exports.sendMessage = async (option) => {
  return await axios({
    method: "POST",
    timeout: requestTimeout,
    url: `${facebookUrl}/${option.phoneNumberId}/messages/`,
    data: {
      messaging_product: "whatsapp",
      to: option.sendTo,
      text: {
        body: option.message,
      },
    },
    headers: {
      Authorization: `Bearer ${option.token}`,
      "Content-type": "application/json",
    },
  });
};

exports.readMessage = async (option) => {
  return await axios({
    method: "POST",
    timeout: requestTimeout,
    url: `${facebookUrl}/${option.phoneNumberId}/messages/`,
    data: {
      messaging_product: "whatsapp",
      status: "read",
      message_id: option.messageId,
    },
    headers: {
      Authorization: `Bearer ${option.token}`,
      "Content-type": "application/json",
    },
  });
};
