//======================================
// file: commands/export-types/export_png_color.js
// version: 1.0
// last updated: 21-07-2025
//======================================

const puppeteer = require('puppeteer');
const svgExporter = require('./export_svg');
const { launchWithProgress } = require('../puppeteer-helper');

/**
 * PNG Color Export Type
 * Converts tree structure to PNG format with full color emoji support using Puppeteer
 */

/**
 * Format tree string as PNG with color emojis (using Puppeteer)
 * @param {string} treeString - The formatted tree string
 * @returns {Buffer} PNG binary data with color emojis
 */
async function format(treeString) {
  // Disable PNG export on Linux due to rendering issues
  if (process.platform === 'linux') {
    throw new Error('Image export not available on Linux at this time');
  }
  
  // Generate SVG using the existing SVG exporter
  const svgContent = svgExporter.format(treeString);
  
  let browser;
  try {
    // Launch headless browser with progress feedback
    browser = await launchWithProgress();
    
    const page = await browser.newPage();
    
    // Create HTML wrapper for SVG
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { margin: 0; padding: 0; }
            svg { display: block; }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
      </html>
    `;
    
    // Set content and capture screenshot
    await page.setContent(htmlContent);
    
    // Wait for fonts to load
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Get SVG element dimensions
    const svgElement = await page.$('svg');
    const boundingBox = await svgElement.boundingBox();
    
    // Take screenshot of just the SVG area
    const screenshot = await page.screenshot({
      type: 'png',
      clip: boundingBox,
      omitBackground: false
    });
    
    return screenshot;
    
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  format,
  extension: "png",
  description: "PNG image with full color emoji support",
  name: "PNG Color",
  binary: true,
  contentType: "image/png"
};