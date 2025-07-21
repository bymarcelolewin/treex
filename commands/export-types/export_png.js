//======================================
// file: commands/export-types/export_png.js
// version: 1.0
// last updated: 20-01-2025
//======================================

const { createCanvas } = require('canvas');

/**
 * PNG Export Type
 * Converts tree structure to PNG image format
 */

/**
 * Format tree string as PNG image with emoji support
 * @param {string} treeString - The formatted tree string
 * @returns {Buffer} PNG image buffer
 */
function format(treeString) {
  const lines = treeString.split('\n').filter(line => line.trim() !== '');
  
  // Calculate canvas dimensions
  const lineHeight = 24; // Increased for emoji rendering
  const padding = 50;
  const maxLineLength = Math.max(...lines.map(line => line.length));
  
  // Estimate character width (monospace)
  const charWidth = 12;
  const canvasWidth = Math.max(600, (maxLineLength * charWidth) + (padding * 2));
  const canvasHeight = (lines.length * lineHeight) + (padding * 2) + 40;
  
  // Create canvas
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');
  
  // Set background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // Draw title
  ctx.font = 'bold 20px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "SF Mono", "Monaco", monospace';
  ctx.fillStyle = '#2c3e50';
  ctx.textBaseline = 'top';
  ctx.fillText('Directory Structure', padding, 20);
  
  // Configure emoji-compatible font for tree content
  ctx.font = '16px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "SF Mono", "Monaco", "Consolas", monospace';
  ctx.fillStyle = '#2c3e50';
  
  // Draw tree lines with emoji support
  lines.forEach((line, index) => {
    const y = padding + 20 + (index * lineHeight);
    
    // Add subtle alternating background for better readability
    if (index % 2 === 0) {
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(padding - 10, y - 3, canvasWidth - (padding * 2) + 20, lineHeight);
    }
    
    // Reset text color
    ctx.fillStyle = '#2c3e50';
    
    // Try to render the line with emojis
    try {
      ctx.fillText(line, padding, y);
    } catch (error) {
      // Fallback: if emoji rendering fails, still draw the text
      console.warn('Emoji rendering failed, falling back to text-only');
      ctx.fillText(line, padding, y);
    }
  });
  
  // Add border
  ctx.strokeStyle = '#bdc3c7';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, canvasWidth - 2, canvasHeight - 2);
  
  return canvas.toBuffer('image/png');
}

module.exports = {
  format,
  extension: "png",
  description: "PNG image format",
  name: "PNG Image",
  binary: true,
  contentType: "image/png"
};