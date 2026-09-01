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
