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
  return await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ...options
  });
}

module.exports = {
  launchWithProgress
};