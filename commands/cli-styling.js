//======================================
// file: commands/cli-styling.js
// version: 1.0
// last updated: 21-07-2025
//======================================

const figlet = require('figlet');
const chalk = require('chalk');
const packageJson = require('../package.json');

/**
 * Generate styled TreeX header with ASCII banner
 * @returns {string} Formatted header string
 */
function generateHeader() {
  try {
    // Generate ASCII art for TreeX
    const banner = figlet.textSync('TreeX', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    });
    
    // Style the banner in green
    const styledBanner = chalk.green(banner);
    
    // Style version and description in white
    const version = chalk.white(`TreeX v${packageJson.version}`);
    const description = chalk.white(packageJson.description);
    const author = chalk.white(`Created by ${packageJson.author.name} from ${packageJson.author.url}`);
    const copyright = chalk.white('© Copyright 2025 - Red Pill Blue Pill Studios, LLC - All Rights Reserved.');
    
    return `${styledBanner}\n\n${version}\n${description}\n${author}\n${copyright}\n`;
  } catch (error) {
    // Fallback if figlet fails
    const fallbackHeader = chalk.green('TreeX') + '\n\n' +
      chalk.white(`TreeX v${packageJson.version}`) + '\n' +
      chalk.white(packageJson.description) + '\n' +
      chalk.white(`Created by ${packageJson.author.name} from ${packageJson.author.url}`) + '\n' +
      chalk.white('© Copyright 2025 - Red Pill Blue Pill Studios, LLC - All Rights Reserved.') + '\n';
    return fallbackHeader;
  }
}

/**
 * Style command flags in green
 * @param {string} text - Text containing command flags
 * @returns {string} Text with styled flags
 */
function styleCommandFlags(text) {
  // Style complete flag combinations like "-V, --version" or single flags
  text = text.replace(/(-[a-zA-Z]+)(,?\s*)(--[a-zA-Z-]+)?/g, (match, shortFlag, separator, longFlag) => {
    let result = chalk.green(shortFlag);
    if (separator) result += chalk.green(separator);
    if (longFlag) result += chalk.green(longFlag);
    return result;
  });
  
  // Style standalone long flags that weren't caught above
  text = text.replace(/(?<!-)(--[a-zA-Z-]+)(?!\w)/g, chalk.green('$1'));
  
  return text;
}

/**
 * Apply white color to descriptions and other text
 * @param {string} text - Text to style
 * @returns {string} White styled text
 */
function styleDescriptions(text) {
  return chalk.white(text);
}

/**
 * Create custom help formatter for Commander.js
 * This function will be used to style the entire help output
 */
function createHelpFormatter() {
  return function(cmd) {
    const header = generateHeader();
    
    // Build help content manually to avoid recursion
    const name = cmd.name();
    const args = cmd.args;
    const options = cmd.options;
    
    let helpText = header + '\n';
    
    // Usage section
    helpText += chalk.white(`Usage: ${name} [options]`);
    if (args && args.length > 0) {
      helpText += chalk.white(` [${args[0].name || args[0]._name || 'dir'}]`);
    }
    helpText += '\n\n';
    
    // Arguments section
    if (args && args.length > 0) {
      helpText += chalk.white('Arguments:\n');
      for (const arg of args) {
        const argName = arg.name || arg._name || 'dir';
        const argDescription = arg.description || arg._description || 'Directory to scan';
        const defaultValue = arg.defaultValue ? ` (default: "${arg.defaultValue}")` : '';
        helpText += chalk.white(`  ${argName}${' '.repeat(Math.max(1, 35 - argName.length))}${argDescription}${defaultValue}\n`);
      }
      helpText += '\n';
    }
    
    // Options section
    if (options && options.length > 0) {
      helpText += chalk.white('Options:\n');
      for (const option of options) {
        const flags = option.flags;
        const optDescription = option.description || '';
        const styledFlags = styleCommandFlags(flags);
        const spacing = ' '.repeat(Math.max(1, 35 - flags.length));
        helpText += `  ${styledFlags}${chalk.white(spacing + optDescription)}\n`;
      }
    }
    
    return helpText;
  };
}

module.exports = {
  generateHeader,
  styleCommandFlags,
  styleDescriptions,
  createHelpFormatter
};