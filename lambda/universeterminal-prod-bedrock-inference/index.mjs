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
    const body = JSON.parse(event.body);
    let { universe_id, command, temperature = 0.7 } = body;

    // Validation
    if (!universe_id || !command) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "universe_id and command required" }),
      };
    }

    // Handle bigbang command - create new universe
    if (command.trim().toLowerCase() === "bigbang") {
      universe_id = generateNewUniverseId(); // You'll need to implement this
    }

    // Get state
    let state = await getUniverseState(universe_id, temperature);

    // Process command
    const result = await processCommand(state, command, temperature);

    // Save state if needed
    if (result.needsSave) {
      await setUniverseState(universe_id, state);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: result.output,
        universe_id: universe_id, // Return the universe_id (important for bigbang)
      }),
    };
  } catch (error) {
    console.error("Lambda error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

function generateNewUniverseId() {
  return (
    "universe_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  );
}
