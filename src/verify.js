exports.lambdaHandler = async (event, context) => {
  try {
    const queryParams = event.queryStringParameters;
    const verify_token = process.env.VERIFY_TOKEN;
  
    let mode = queryParams["hub.mode"];
    let token = queryParams["hub.verify_token"];
    let challenge = queryParams["hub.challenge"];
  
    if (mode && token) {
      if (mode === "subscribe" && token === verify_token) {
        console.log("WEBHOOK_VERIFIED");
        return {
          statusCode: 200,
          body: challenge,
        };
      } else {
        return {
          statusCode: 403,
        };
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
