const { Configuration, OpenAIApi } = require("openai");
const secrets = require("./secrets");

const vault = process.env.VAULT;

exports.getSecretsString = async (vault) => {
  const secretValue = await secrets.getSecrets(vault);
  return JSON.parse(secretValue.SecretString);
}

exports.getOpenAiResponse = async (clientText) => {
  const { openaiKey, organizationId } = await this.getSecretsString(vault);
  let botResponse = "";

  const options = {
    model: "text-davinci-003", // gpt model
    prompt: clientText,
    temperature: 1, // 1 max
    max_tokens: 4000, // 4000 max
  };

  const openaiConfig = new Configuration({
    organization: organizationId,
    apiKey: openaiKey,
  });
  const openai = new OpenAIApi(openaiConfig);
  const response = await openai.createCompletion(options);
  
  response.data.choices.forEach(({ text }) => {
    botResponse += text;
  });

  return botResponse.trim();
};
