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
  const { universe_id, command, temperature } = JSON.parse(event.body);

  // 1. Get state from DynamoDB
  const res = await ddb.send(
    new GetItemCommand({
      TableName: "universeterminal",
      Key: { universe_id: { S: universe_id } },
    })
  );

  let state;
  if (res.Item) {
    state = {
      wd: res.Item.wd?.S || "/universe",
      structure: JSON.parse(res.Item.structure?.S || "{}"),
      history: res.Item.history?.S || "",
      temperature: parseFloat(res.Item.temperature?.N || temperature),
    };
  } else {
    // brand new universe
    state = {
      wd: "/universe",
      structure: { name: "universe", contents: [] },
      history: "",
      temperature,
    };
  }

  // 2. Parse command
  const [cmd, ...args] = command.split(" ");
  let output = "";

  if (cmd === "pwd") {
    output = state.wd;
  } else if (cmd === "ls") {
    const node = findNode(state.structure, state.wd); // helper function
    output = node.contents.map((c) => c.name).join(" ");
  } else if (cmd === "cd") {
    const target = args[0];
    const node = findNode(state.structure, state.wd);
    const child = node.contents.find(
      (c) => c.name === target && c.type === "dir"
    );
    if (child) {
      state.wd = state.wd + "/" + target;
      output = `cd success`;
    } else {
      output = `cd: directory ${target} not found`;
    }
  } else {
    // Fallback to Bedrock
    const bedrockRes = await bedrock.send(
      new InvokeModelCommand({
        modelId: "amazon.titan-text-lite-v1",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          inputText: `Universe state:\n${state.history}\n\nUser command: ${command}`,
          textGenerationConfig: { temperature },
        }),
      })
    );
    output = JSON.parse(new TextDecoder().decode(bedrockRes.body)).results[0]
      .outputText;
  }

  // 3. Update history + save back
  state.history += `\n* ${command}\n${output}`;
  await ddb.send(
    new PutItemCommand({
      TableName: "universeterminal",
      Item: {
        universe_id: { S: universe_id },
        wd: { S: state.wd },
        structure: { S: JSON.stringify(state.structure) },
        history: { S: state.history },
        temperature: { N: state.temperature.toString() },
        expires_at: { N: (Math.floor(Date.now() / 1000) + 300).toString() },
      },
    })
  );

  return { statusCode: 200, body: JSON.stringify({ message: output }) };
};
