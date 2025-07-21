//======================================
// file: commands/export-types/export_md.js
// version: 1.0
// last updated: 20-01-2025
//======================================

/**
 * Markdown Export Type
 * Formats tree structure as Markdown with code blocks
 */

/**
 * Format tree string as Markdown
 * @param {string} treeString - The formatted tree string
 * @returns {string} Markdown formatted content
 */
function format(treeString) {
  return `# Folder Structure

\`\`\`
${treeString}
\`\`\`
`;
}

module.exports = {
  format,
  extension: "md",
  description: "Markdown format with code blocks",
  name: "Markdown",
  binary: false
};