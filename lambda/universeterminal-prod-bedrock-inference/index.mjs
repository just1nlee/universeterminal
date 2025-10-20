// universeterminal-prod-bedrock-inference Lambda function handler

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { getUniverseState, setUniverseState } from "./dynamodb-helpers.mjs";
import { processCommand } from "./lambda-helpers.mjs";

const ddb = new DynamoDBClient({ region: "us-west-2" });
const bedrock = new BedrockRuntimeClient({ region: "us-west-2" });

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    let { universe_id, command, temperature = 0.7 } = body;

    if (!universe_id || !command) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "universe_id and command required" }),
      };
    }

    let state = await getUniverseState(universe_id, temperature);

    const result = await processCommand(state, command, temperature);

    // Save state if needed
    if (result.needsSave) {
      await setUniverseState(universe_id, state);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: result.output,
        universe_id: universe_id,
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
