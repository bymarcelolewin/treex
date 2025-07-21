//======================================
// file: commands/emoji-management.js
// version: 1.0
// last updated: 21-07-2025
//======================================

const fs = require('fs');
const path = require('path');

// Path configuration
const EMOJIS_FILE = path.join(__dirname, '..', 'config', 'emojis.json');
const DEFAULT_EMOJIS_FILE = path.join(__dirname, '..', 'config', 'emojis-default.json');

// Valid emoji types
const VALID_TYPES = ['folder', 'file', 'hidden', 'locked', 'permissionDenied'];

/**
 * List current emoji configuration
 */
function listEmojis() {
  try {
    const emojis = JSON.parse(fs.readFileSync(EMOJIS_FILE, 'utf8'));
    
    console.log('Current Emoji Configuration:\n');
    
    // Display emojis in the format: 📂 folder
    for (const [type, emoji] of Object.entries(emojis)) {
      console.log(`${emoji} ${type}`);
    }
  } catch (error) {
    console.error(`Error reading emoji configuration: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Validate if a string contains emoji characters
 * @param {string} str - String to validate
 * @returns {boolean} - True if contains emoji
 */
function isValidEmoji(str) {
  // Emoji regex pattern to match various emoji ranges
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]/u;
  
  return emojiRegex.test(str) && str.trim().length > 0;
}

/**
 * Update emoji for specified type
 * @param {string} type - Emoji type (folder, file, etc.)
 * @param {string} emoji - New emoji character
 */
function updateEmoji(type, emoji) {
  try {
    // Validate type
    if (!VALID_TYPES.includes(type)) {
      console.error(`Error: Invalid emoji type '${type}'`);
      console.error(`Valid types: ${VALID_TYPES.join(', ')}`);
      process.exit(1);
    }

    // Validate emoji
    if (!isValidEmoji(emoji)) {
      console.error('Error: Invalid emoji. Please provide a valid emoji character.');
      process.exit(1);
    }

    // Read current emojis
    const emojis = JSON.parse(fs.readFileSync(EMOJIS_FILE, 'utf8'));
    
    // Update the specific emoji
    const oldEmoji = emojis[type];
    emojis[type] = emoji;
    
    // Write back to file
    fs.writeFileSync(EMOJIS_FILE, JSON.stringify(emojis, null, 2));
    
    console.log(`✅ Updated ${type} emoji: ${oldEmoji} → ${emoji}`);
  } catch (error) {
    console.error(`Error updating emoji: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Restore all emojis to default configuration
 */
function restoreEmojis() {
  try {
    // Check if default file exists
    if (!fs.existsSync(DEFAULT_EMOJIS_FILE)) {
      console.error('Error: Default emoji configuration file not found');
      process.exit(1);
    }

    // Copy default emojis to active config
    const defaultEmojis = fs.readFileSync(DEFAULT_EMOJIS_FILE, 'utf8');
    fs.writeFileSync(EMOJIS_FILE, defaultEmojis);
    
    console.log('✅ All emojis restored to default configuration');
  } catch (error) {
    console.error(`Error restoring emojis: ${error.message}`);
    process.exit(1);
  }
}

module.exports = {
  listEmojis,
  updateEmoji,
  restoreEmojis
};