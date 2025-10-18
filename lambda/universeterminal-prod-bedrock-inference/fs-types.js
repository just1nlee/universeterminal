/**
 * A file node in the filesystem
 * @typedef {Object} FileNode
 * @property {string} type - Always "file"
 * @property {string} name - Filename
 * @property {string} content - File contents
 */

/**
 * A directory node in the filesystem
 * @typedef {Object} DirNode
 * @property {string} type - Always "dir"
 * @property {string} name - Directory name
 * @property {Array<FileNode|DirNode>} contents - Array of child nodes
 */

/**
 * Factory function to create a file node
 * @param {string} name - The filename
 * @param {string} content - The file contents
 * @returns {FileNode}
 */
export function file(name, content = "") {
  return {
    type: "file",
    name: name,
    content: content,
  };
}

/**
 * Factory function to create a directory node
 * @param {string} name - The directory name
 * @param {Array} contents - Array of child nodes (files/directories)
 * @returns {DirNode}
 */
export function dir(name, contents = []) {
  return {
    type: "dir",
    name: name,
    contents: contents,
  };
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
