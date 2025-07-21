//======================================
// file: commands/scan-folder.js
// version: 1.8
// last updated: 06-04-2025
//======================================

require("module-alias/register");
const fs = require("fs");
const path = require("path");

const ignoredNames = require("@ignored");
const emojis = require("@emojis");

const IGNORED_NAMES = new Set(ignoredNames);

/**
 * Check if a filename matches any of the ignored patterns (supports glob patterns)
 * @param {string} filename - The filename to check
 * @returns {boolean} True if the file should be ignored
 */
function isIgnored(filename) {
  // Check exact matches first (for backward compatibility)
  if (IGNORED_NAMES.has(filename)) {
    return true;
  }
  
  // Check glob patterns
  for (const pattern of ignoredNames) {
    if (pattern.includes('*') || pattern.includes('?')) {
      // Convert glob pattern to regex
      const regexPattern = pattern
        .replace(/\./g, '\\.')  // Escape dots
        .replace(/\*/g, '.*')   // * matches any characters
        .replace(/\?/g, '.');   // ? matches single character
      
      const regex = new RegExp(`^${regexPattern}$`, 'i'); // Case insensitive
      if (regex.test(filename)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Core tree scanning function - used by both console output and export
 * @param {string} dirPath - The root folder to scan
 * @param {string} prefix - Used internally for formatting
 * @param {boolean} isRoot - Whether this is the initial (top-level) call
 * @param {boolean} showDetails - Whether to show extra metadata like locked
 * @param {Object} options - Additional behavior flags
 * @param {boolean} options.collapsed - Show only the top-level entries
 * @param {boolean} options.foldersOnly - Skip files, show only folders recursively
 * @returns {string[]} Array of formatted tree lines
 */
function generateTreeLines(dirPath, prefix = "", isRoot = true, showDetails = false, options = {}) {
  let lines = [];
  let entries;

  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (err) {
    return [`Error reading ${dirPath}: ${err.message}`];
  }

  entries = entries
    .filter(entry => {
      if (isIgnored(entry.name)) return false;
      if (options.foldersOnly && !entry.isDirectory()) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  if (isRoot) {
    const folderName = path.basename(path.resolve(dirPath));
    let locked = "";
    if (showDetails) {
      try {
        fs.accessSync(dirPath, fs.constants.W_OK);
      } catch {
        locked = ` ${emojis.locked}`;
      }
    }
    lines.push(`${emojis.folder} ${folderName}${locked}`);
  }

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const isHidden = entry.name.startsWith(".");
    const isFolder = entry.isDirectory();
    const icon = isFolder ? emojis.folder : emojis.file;

    let details = "";
    if (showDetails) {
      const fullPath = path.join(dirPath, entry.name);
      try {
        fs.accessSync(fullPath, fs.constants.W_OK);
      } catch {
        details += ` ${emojis.locked}`;
      }
      if (isHidden) {
        details += ` ${emojis.hidden}`;
      }
    }

    const line = `${prefix}${isLast ? "└──" : "├──"} ${icon} ${entry.name}${details}`;
    lines.push(line);

    const shouldRecurse = isFolder && !options.collapsed;

    if (shouldRecurse) {
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      const subPath = path.join(dirPath, entry.name);
      
      // Check if we can access the directory before recursing
      try {
        fs.accessSync(subPath, fs.constants.R_OK);
        const subLines = generateTreeLines(subPath, nextPrefix, false, showDetails, options);
        lines.push(...subLines);
      } catch (err) {
        lines.push(`${nextPrefix}└── ${emojis.permissionDenied} Permission denied`);
      }
    }
  });

  return lines;
}

/**
 * Recursively prints a directory tree structure with emojis and optional details
 * @param {string} dirPath - The root folder to scan
 * @param {string} prefix - Used internally for formatting
 * @param {boolean} isRoot - Whether this is the initial (top-level) call
 * @param {boolean} showDetails - Whether to show extra metadata like locked
 * @param {Object} options - Additional behavior flags
 * @param {boolean} options.collapsed - Show only the top-level entries
 * @param {boolean} options.foldersOnly - Skip files, show only folders recursively
 */
function printTree(dirPath, prefix = "", isRoot = true, showDetails = false, options = {}) {
  const lines = generateTreeLines(dirPath, prefix, isRoot, showDetails, options);
  lines.forEach(line => console.log(line));
}

/**
 * Generates tree data structure for web interface
 * @param {string} dirPath - The root folder to scan
 * @param {Object} options - Additional behavior flags
 * @returns {Object} Tree data structure with nested children
 */
function getTreeData(dirPath, options = {}) {
  const showDetails = options.details || false;
  
  function buildTree(currentPath, isRoot = true) {
    let entries;
    
    try {
      entries = fs.readdirSync(currentPath, { withFileTypes: true });
    } catch (err) {
      return { error: `Error reading ${currentPath}: ${err.message}` };
    }

    entries = entries
      .filter(entry => {
        if (isIgnored(entry.name)) return false;
        if (options.foldersOnly && !entry.isDirectory()) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
      });

    const result = {
      name: isRoot ? path.basename(path.resolve(currentPath)) : path.basename(currentPath),
      path: currentPath,
      isDirectory: true,
      isRoot,
      children: []
    };

    entries.forEach(entry => {
      const fullPath = path.join(currentPath, entry.name);
      const isFolder = entry.isDirectory();
      const isHidden = entry.name.startsWith(".");
      
      let locked = false;
      if (showDetails) {
        try {
          fs.accessSync(fullPath, fs.constants.W_OK);
        } catch {
          locked = true;
        }
      }

      const nodeData = {
        name: entry.name,
        path: fullPath,
        isDirectory: isFolder,
        isHidden,
        locked,
        icon: isFolder ? emojis.folder : emojis.file
      };

      if (isFolder && !options.collapsed) {
        const childTree = buildTree(fullPath, false);
        nodeData.children = childTree.children;
      } else {
        nodeData.children = [];
      }

      result.children.push(nodeData);
    });

    return result;
  }

  return buildTree(dirPath);
}

/**
 * Generates tree structure as a string instead of printing to console
 * @param {string} dirPath - The root folder to scan
 * @param {string} prefix - Used internally for formatting
 * @param {boolean} isRoot - Whether this is the initial (top-level) call
 * @param {boolean} showDetails - Whether to show extra metadata like locked
 * @param {Object} options - Additional behavior flags
 * @param {boolean} options.collapsed - Show only the top-level entries
 * @param {boolean} options.foldersOnly - Skip files, show only folders recursively
 * @returns {string} The formatted tree string
 */
function getTreeString(dirPath, prefix = "", isRoot = true, showDetails = false, options = {}) {
  const lines = generateTreeLines(dirPath, prefix, isRoot, showDetails, options);
  return lines.join('\n');
}

module.exports = printTree;
module.exports.getTreeData = getTreeData;
module.exports.getTreeString = getTreeString;