//======================================
// file: commands/export-types/export_svg.js
// version: 1.0
// last updated: 20-01-2025
//======================================

/**
 * SVG Export Type
 * Converts tree structure to SVG format with excellent emoji support
 */

/**
 * Escape XML special characters
 * @param {string} text - Text to escape
 * @returns {string} XML-escaped text
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Format tree string as SVG
 * @param {string} treeString - The formatted tree string
 * @returns {string} SVG content
 */
function format(treeString) {
  const lines = treeString.split('\n').filter(line => line.trim() !== '');
  
  // Calculate SVG dimensions - ensure no text cutoff
  const fontSize = 16;
  const lineHeight = fontSize+7; // Make lineHeight = fontSize so lines TOUCH (no gaps)
  const padding = 10;
  const charWidth = 9.6; // More accurate character width for monospace
  const maxLineLength = Math.max(...lines.map(line => line.length));
  
  const svgWidth = (maxLineLength * charWidth) + (padding * 2) + 20; // Extra width to prevent cutoff
  const svgHeight = (lines.length * lineHeight) + (padding * 2);
  
  // Start SVG - no border, exact size
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .tree-text {
        font: ${fontSize}px 'SF Mono', 'Monaco', 'Consolas', monospace;
        fill: #ffffff;
        dominant-baseline: hanging;
        white-space: pre;
      }
    </style>
  </defs>
  
  <!-- Clean black background, no border -->
  <rect width="100%" height="100%" fill="#000000"/>
  
`;

  // Add tree lines with proper spacing like console output
  lines.forEach((line, index) => {
    const y = padding + (index * lineHeight); // Proper line spacing
    
    // Add text line with proper XML escaping
    const escapedLine = escapeXml(line);
    svg += `  <text x="${padding}" y="${y}" class="tree-text">${escapedLine}</text>\n`;
  });
  
  // Close SVG
  svg += '</svg>';
  
  return svg;
}

module.exports = {
  format,
  extension: "svg",
  description: "SVG vector format with emoji support",
  name: "SVG Vector",
  binary: false,
  contentType: "image/svg+xml"
};