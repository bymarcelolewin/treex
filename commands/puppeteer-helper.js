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

Note: Other formats will work without Chromium.`);
    }
    throw error;
  }
}

module.exports = {
  launchWithProgress
};