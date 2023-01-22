const { Configuration, OpenAIApi } = require("openai");

exports.configureOpenAi = async (openaiKey, organizationId) => {
  try {
    const openaiConfig = new Configuration({
      organization: organizationId,
      apiKey: openaiKey,
    });
    return openaiConfig;
  } catch (ex) {
    console.error("Error", ex);
    return {
      statusCode: ex.statusCode ? ex.statusCode : 500,
      body: JSON.stringify(
        {
          error: ex.name ? ex.name : "Exception",
          message: ex.message ? ex.message : "Unknown error",
          stack: ex.stack ? ex.stack : "Unknown trace",
        },
        null,
        2
      ),
    };
  }
};

exports.getOpenAiResponse = async (openaiConfig, clientText) => {
  const openai = new OpenAIApi(openaiConfig);
  const options = {
    model: "text-davinci-003", // gpt model
    prompt: clientText,
    temperature: 1, // 1 max
    max_tokens: 4000, // 4000 max
  };

  try {
    const response = await openai.createCompletion(options);
    let botResponse = "";
    response.data.choices.forEach(({ text }) => {
      botResponse += text;
    });
    return botResponse.trim();
  } catch (ex) {
    console.error("Error", ex);
    return {
      statusCode: ex.statusCode ? ex.statusCode : 500,
      body: JSON.stringify(
        {
          error: ex.name ? ex.name : "Exception",
          message: ex.message ? ex.message : "Unknown error",
          stack: ex.stack ? ex.stack : "Unknown trace",
        },
        null,
        2
      ),
    };
  }
};
