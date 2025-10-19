import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { createBaseUniverse } from "./fs-helpers.mjs";

const ddb = new DynamoDBClient({ region: "us-west-2" });

/**
 * Get universe state from DynamoDB or create new one
 * @param {string} universe_id
 * @param {number} temperature
 * @returns {Promise<Object>} Universe state object
 */
export async function getUniverseState(universe_id, temperature) {
  try {
    const result = await ddb.send(
      new GetItemCommand({
        TableName: "universeterminal",
        Key: { universe_id: { S: universe_id } },
      })
    );

    if (result.Item) {
      // Parse existing state
      return {
        wd: result.Item.wd.S,
        structure: JSON.parse(result.Item.structure.S),
        history: result.Item.history?.S || "",
        temperature: parseFloat(result.Item.temperature.N),
      };
    } else {
      // Create new universe state
      const newState = {
        wd: "/universe",
        structure: createBaseUniverse(temperature),
        history: "",
        temperature,
      };

      // Save to DynamoDB
      await setUniverseState(universe_id, newState);

      return newState;
    }
  } catch (error) {
    console.error("Error getting universe state:", error);
    throw error;
  }
}

/**
 * Save universe state to DynamoDB
 * @param {string} universe_id
 * @param {Object} state
 */
export async function setUniverseState(universe_id, state) {
  await ddb.send(
    new PutItemCommand({
      TableName: "universeterminal",
      Item: {
        universe_id: { S: universe_id },
        wd: { S: state.wd },
        structure: { S: JSON.stringify(state.structure) },
        history: { S: state.history },
        temperature: { N: state.temperature.toString() },
      },
    })
  );
}
