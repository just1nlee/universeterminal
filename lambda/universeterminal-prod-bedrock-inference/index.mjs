// universeterminal-prod-bedrock-inference Lambda function handler

import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const ddb = new DynamoDBClient({ region: "us-west-2" });
const bedrock = new BedrockRuntimeClient({ region: "us-west-2" });

export const handler = async (event) => {
  try {
    // Step 1: Parse and validate the incoming request
    const body = JSON.parse(event.body);
    const { universe_id, command, temperature = 0.7 } = body;

    // Basic validation
    if (!universe_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "universe_id is required" }),
      };
    }

    if (!command) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "command is required" }),
      };
    }

    // Step 2: For now, just echo back what we received
    const response = {
      universe_id,
      command,
      temperature,
      message: `Received command: ${command}`,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Lambda error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
    };
  }
};
