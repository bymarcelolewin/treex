//======================================
// file: commands/ignored-files.js
// version: 1.2
// last updated: 06-04-2025
//======================================

require("module-alias/register");
const fs = require("fs");
const path = require("path");

const ignoredPath = path.join(__dirname, "..", "config", "ignored-names.json");
let ignoredNames = require("@ignored");

function saveIgnoredList(list) {
  fs.writeFileSync(ignoredPath, JSON.stringify(list, null, 2), "utf-8");
}

/**
 * Handles logic for --show-ignored flag
 */
function showIgnoredFiles() {
  console.log("🛑 Ignored file and folder names:");
  ignoredNames.forEach(name => console.log(`- ${name}`));
}

/**
 * Handles logic for --add-ignored
 */
function addIgnoredFiles(names) {
  const newItems = [];
  const alreadyExists = [];

  names.forEach(name => {
    if (ignoredNames.includes(name)) {
      alreadyExists.push(name);
    } else {
      newItems.push(name);
    }
  });

  if (newItems.length > 0) {
    ignoredNames = [...ignoredNames, ...newItems];
    saveIgnoredList(ignoredNames);
    console.log("✅ Added to ignored list:");
    newItems.forEach(name => console.log(`+ ${name}`));
  }

  if (alreadyExists.length > 0) {
    console.log("⚠️  Already in ignored list (skipped):");
    alreadyExists.forEach(name => console.log(`• ${name}`));
  }

  if (newItems.length === 0 && alreadyExists.length === 0) {
    console.log("ℹ️  No names provided to add.");
  }
}

/**
 * Handles logic for --remove-ignored
 */
function removeIgnoredFiles(names) {
  const notFound = [];
  const toRemove = names.filter(name => {
    if (ignoredNames.includes(name)) {
      return true;
    } else {
      notFound.push(name);
      return false;
    }
  });

  if (toRemove.length > 0) {
    ignoredNames = ignoredNames.filter(name => !toRemove.includes(name));
    saveIgnoredList(ignoredNames);
    console.log("✅ Removed from ignored list:");
    toRemove.forEach(name => console.log(`- ${name}`));
  }

  if (notFound.length > 0) {
    console.log("⚠️  These names were not found in the ignored list:");
    notFound.forEach(name => console.log(`• ${name}`));
  }

  if (toRemove.length === 0 && notFound.length === 0) {
    console.log("ℹ️  No names provided to remove.");
  }
}

module.exports = {
  showIgnoredFiles,
  addIgnoredFiles,
  removeIgnoredFiles
};