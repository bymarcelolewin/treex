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
 * Estimate text width for monospace font
 * @param {string} text - Text to measure
 * @param {number} fontSize - Font size in pixels
 * @returns {number} Estimated width in pixels
 */
function estimateTextWidth(text, fontSize) {
  // More accurate width calculation for monospace fonts
  // Account for different character types
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.match(/[📂📄🕶️🔒🚫]/)) {
      // Emojis are wider
      width += fontSize * 1.2;
    } else if (char.match(/[WMm]/)) {
      // Wide characters
      width += fontSize * 0.7;
    } else if (char.match(/[il]/)) {
      // Narrow characters
      width += fontSize * 0.5;
    } else {
      // Regular monospace characters
      width += fontSize * 0.65;
    }
  }
  return width;
}

/**
 * Format tree string as SVG
 * @param {string} treeString - The formatted tree string
 * @returns {string} SVG content
 */
function format(treeString) {
  // Disable SVG export on Linux due to rendering issues
  if (process.platform === 'linux') {
    throw new Error('Image export not available on Linux at this time');
  }
  
  const lines = treeString.split('\n').filter(line => line.trim() !== '');
  
  // Calculate SVG dimensions dynamically based on actual content
  const fontSize = 16;
  const lineHeight = fontSize + 7;
  const padding = 10;
  
  // Calculate the actual maximum width needed
  const maxWidth = Math.max(...lines.map(line => estimateTextWidth(line, fontSize)));
  
  const svgWidth = maxWidth + (padding * 2) + 20; // Small buffer for safety
  const svgHeight = (lines.length * lineHeight) + (padding * 2);
  
  // Start SVG - no border, exact size
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .tree-text {
        font: ${fontSize}px 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'SF Mono', 'Monaco', 'Consolas', monospace;
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