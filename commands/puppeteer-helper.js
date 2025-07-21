//======================================
// file: commands/puppeteer-helper.js
// version: 1.1
// last updated: 21-07-2025
//======================================

const puppeteer = require('puppeteer');

/**
 * Launch Puppeteer with standard configuration
 * @param {Object} options - Puppeteer launch options
 * @returns {Promise<Browser>} Puppeteer browser instance
 */
async function launchWithProgress(options = {}) {
  try {
    return await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ...options
    });
  } catch (error) {
    if (error.message.includes('Could not find Chrome') || error.message.includes('Could not find browser')) {
      throw new Error(`
🔧 Chromium is required for exporting to PNG and WebP formats, but your system doesn't have it installed.

To install Chromium, please run:
  npx puppeteer browsers install chrome

On some Linux systems, you may need to use sudo:
  sudo npx puppeteer browsers install chrome

Note: SVG and Markdown exports will work without Chromium.`);
    }
    
    if (error.message.includes('Failed to launch the browser process') && 
        (error.message.includes('ELF: not found') || error.message.includes('Syntax error'))) {
      throw new Error(`
🔧 Architecture mismatch: Chromium binary is incompatible with your system architecture.

For ARM-based systems (Raspberry Pi, Apple Silicon), install system Chromium:
  sudo apt-get install chromium-browser

TreeX will automatically detect and use the system Chromium - no additional setup needed!

Alternative: Use SVG and Markdown exports which don't require Chromium.

For more help: https://pptr.dev/troubleshooting`);
    }
    
    throw error;
  }
}

module.exports = {
  launchWithProgress
};