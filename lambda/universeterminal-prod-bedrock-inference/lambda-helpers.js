import {
  findNode,
  joinPath,
  normalizePath,
  pathToParts,
  makeBaseUniverse,
} from "./fs-helpers.js";
import { dir, file } from "./fs-types.js";
import {
  generateContent,
  generateDirectoryContents,
} from "./bedrock-helpers.js";

export async function processCommand(state, command, temperature) {
  const [cmd, ...args] = command.trim().split(/\s+/);

  switch (cmd.toLowerCase()) {
    case "pwd":
      return handlePwd(state);

    case "ls":
      return await handleLs(state, args, temperature);

    case "cd":
      return await handleCd(state, args, temperature);

    case "tree":
      return handleTree(state, args);

    case "cat":
      return await handleCat(state, args, temperature);

    case "info":
      return await handleInfo(state, args, temperature);

    case "bigbang":
      return handleBigBang(state, temperature);

    default:
      return {
        output: `Command '${cmd}' not recognized. Available: pwd, ls, cd, tree, cat, info, bigbang`,
        needsSave: false,
      };
  }
}

// === BASIC FILESYSTEM COMMANDS ===
function handlePwd(state) {
  return {
    output: state.wd,
    needsSave: false,
  };
}

async function handleLs(state, args, temperature) {
  const targetPath = args[0] ? joinPath(state.wd, args[0]) : state.wd;
  let node = findNode(state.structure, targetPath);

  if (!node) {
    return {
      output: `ls: cannot access '${
        args[0] || targetPath
      }': No such file or directory`,
      needsSave: false,
    };
  }

  if (node.type !== "dir") {
    return {
      output: node.name,
      needsSave: false,
    };
  }

  let hasExpanded = false;

  // Check if directory needs AI-generated content
  if (needsExpansion(node)) {
    await expandDirectory(node, targetPath, temperature);
    hasExpanded = true;
  }

  const contents = node.contents
    .map((item) => (item.type === "dir" ? `${item.name}/` : item.name))
    .join("  ");

  return {
    output: contents,
    needsSave: hasExpanded,
  };
}

async function handleCd(state, args, temperature) {
  if (!args[0]) {
    return {
      output: "cd: missing operand",
      needsSave: false,
    };
  }

  const targetPath = joinPath(state.wd, args[0]);
  let node = findNode(state.structure, targetPath);

  if (!node) {
    return {
      output: `cd: ${args[0]}: No such file or directory`,
      needsSave: false,
    };
  }

  if (node.type !== "dir") {
    return {
      output: `cd: ${args[0]}: Not a directory`,
      needsSave: false,
    };
  }

  let hasExpanded = false;

  // Generate content if directory is empty/unexplored
  if (needsExpansion(node)) {
    await expandDirectory(node, targetPath, temperature);
    hasExpanded = true;
  }

  state.wd = targetPath;
  return {
    output: "",
    needsSave: true, // Always save when changing directory
  };
}

function handleTree(state, args) {
  const targetPath = args[0] ? joinPath(state.wd, args[0]) : state.wd;
  const node = findNode(state.structure, targetPath);

  if (!node) {
    return {
      output: `tree: ${args[0]}: No such file or directory`,
      needsSave: false,
    };
  }

  if (node.type !== "dir") {
    return {
      output: `tree: ${args[0]}: Not a directory`,
      needsSave: false,
    };
  }

  return {
    output: generateTreeView(node),
    needsSave: false,
  };
}

async function handleCat(state, args, temperature) {
  if (!args[0]) {
    return {
      output: "cat: missing file operand",
      needsSave: false,
    };
  }

  const filePath = joinPath(state.wd, args[0]);
  let node = findNode(state.structure, filePath);

  if (!node) {
    return {
      output: `cat: ${args[0]}: No such file or directory`,
      needsSave: false,
    };
  }

  if (node.type !== "file") {
    return {
      output: `cat: ${args[0]}: Is a directory`,
      needsSave: false,
    };
  }

  let needsSave = false;

  // Generate content if file is empty
  if (!node.content || node.content.trim() === "") {
    node.content = await generateFileContent(filePath, args[0], temperature);
    needsSave = true;
  }

  return {
    output: node.content,
    needsSave,
  };
}

async function handleInfo(state, args, temperature) {
  const targetPath = args[0] ? joinPath(state.wd, args[0]) : state.wd;
  let node = findNode(state.structure, targetPath);

  if (!node) {
    return {
      output: `info: ${args[0]}: No such file or directory`,
      needsSave: false,
    };
  }

  // Check if we need to generate info for this location
  const infoKey = `_info_${targetPath.replace(/\//g, "_")}`;

  if (!node[infoKey]) {
    const prompt = `You are exploring a cosmic filesystem. Generate a detailed, immersive description of the location: ${targetPath}
    
    Context: This is ${node.type === "dir" ? "a directory" : "a file"} named "${
      node.name
    }"
    Path: ${targetPath}
    
    Write 2-3 sentences describing what this cosmic location looks like, what might be found here, or what significance it has. Be creative but consistent with a space exploration theme.`;

    node[infoKey] = await generateContent(prompt, temperature);
  }

  return {
    output: node[infoKey],
    needsSave: true,
  };
}

function handleBigBang(state, temperature) {
  // Reset universe to initial state
  state.structure = makeBaseUniverse(temperature);
  state.wd = "/universe";
  state.history = "Big Bang initiated! Universe reset to primordial state.";

  return {
    output:
      "🌌 BIG BANG! 🌌\nUniverse has been reset to its primordial state.\nReality reconstructed. Begin exploration anew.",
    needsSave: true,
  };
}

// === HELPER FUNCTIONS ===
function needsExpansion(node) {
  return (
    node.contents.length === 0 ||
    (node.contents.length === 1 && node.contents[0].name.endsWith("-index.txt"))
  );
}

async function expandDirectory(node, path, temperature) {
  const newItems = await generateDirectoryContents(path, temperature);

  for (const item of newItems) {
    if (item.type === "dir") {
      node.contents.push(dir(item.name));
    } else {
      node.contents.push(file(item.name, item.description || ""));
    }
  }
}

async function generateFileContent(filePath, filename, temperature) {
  const prompt = `Generate realistic content for a file in a cosmic exploration filesystem.
  
  File: ${filename}
  Location: ${filePath}
  
  Create 2-4 lines of content that would realistically be in this file. Use scientific, astronomical, or exploration language. Be creative but concise.`;

  return await generateContent(prompt, temperature);
}

function generateTreeView(node, prefix = "") {
  let result = node.name + (node.type === "dir" ? "/\n" : "\n");

  if (node.type === "dir") {
    for (let i = 0; i < node.contents.length; i++) {
      const item = node.contents[i];
      const isLast = i === node.contents.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const childPrefix = prefix + (isLast ? "    " : "│   ");

      result += prefix + connector;

      if (item.type === "dir") {
        result += generateTreeView(item, childPrefix);
      } else {
        result += item.name + "\n";
      }
    }
  }

  return result;
}
