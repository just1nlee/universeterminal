import { dir, file } from "./fs-types.js";

/**
 * Convert path string to array of parts
 * Examples: "/universe/galaxies" → ["universe", "galaxies"]
 *          "/" → []
 * @param {string} path
 * @returns {string[]}
 */
export function pathToParts(path) {
  if (path === "/") return [];
  return path.split("/").filter((part) => part.length > 0);
}

/**
 * Find a node in the filesystem tree by following a path
 * @param {DirNode} root - The root directory to start from
 * @param {string} path - Path like "/universe/galaxies"
 * @returns {FileNode|DirNode|null} - The found node or null
 */
export function findNode(root, path) {
  const parts = pathToParts(path);

  // If asking for root path "/"
  if (parts.length === 0) {
    return root;
  }

  let currentNode = root;

  // Walk through each part of the path
  for (const part of parts) {
    // Can only navigate INTO directories, not files
    if (currentNode.type !== "dir") {
      return null; // Trying to cd into a file
    }

    // Look for the next part in the current directory's contents
    const nextNode = currentNode.contents.find((node) => node.name === part);

    if (!nextNode) {
      return null; // Path doesn't exist
    }

    currentNode = nextNode;
  }

  return currentNode;
}

/**
 * Join two paths together and normalize
 * @param {string} basePath - Current working directory
 * @param {string} relativePath - Relative path from user
 * @returns {string} - Absolute normalized path
 */
export function joinPath(basePath, relativePath) {
  // If relative path starts with /, it's actually absolute
  if (relativePath.startsWith("/")) {
    return normalizePath(relativePath);
  }

  // Otherwise join with current directory
  return normalizePath(basePath + "/" + relativePath);
}

/**
 * Normalize a path (handle .. and . references)
 * @param {string} path
 * @returns {string}
 */
export function normalizePath(path) {
  const parts = pathToParts(path);
  const normalized = [];

  for (const part of parts) {
    if (part === "..") {
      normalized.pop(); // Go up one directory
    } else if (part !== ".") {
      normalized.push(part);
    }
  }

  return "/" + normalized.join("/");
}

/**
 * Create the base universe structure based on temperature
 * @param {number} temperature
 * @returns {DirNode}
 */
export function makeBaseUniverse(temperature) {
  switch (temperature) {
    case 0.1:
      return dir("universe", [
        dir("large_scale_structures"),
        dir("superclusters"),
        dir("fundamentals"),
        file(
          "readme.txt",
          "Explore scientifically accurate structures of the universe."
        ),
      ]);

    case 0.5:
      return dir("universe", [
        dir("galaxies"),
        dir("civilizations"),
        dir("artifacts"),
        file(
          "captains_log.txt",
          "Log Entry #1: Humanity reaches for the stars. What secrets await?"
        ),
      ]);

    case 0.9:
      return dir("multiverse", [
        dir("parallel_universes"),
        dir("galactic_wars"),
        dir("anomalies"),
        file(
          "prophecy.txt",
          "Beware the collapse of dimensions. The multiverse teeters on chaos."
        ),
      ]);

    default:
      return dir("universe", [
        dir("galaxies"),
        dir("stars"),
        file(
          "readme.txt",
          "Welcome to the universeterminal. Explore the observable universe!"
        ),
      ]);
  }
}
