//======================================
// file: commands/export-types/index.js
// version: 1.0
// last updated: 20-01-2025
//======================================

const fs = require("fs");
const path = require("path");

/**
 * Auto-discover and register all export types in the export-types directory
 * @returns {Object} Registry of available export types
 */
function getAvailableExportTypes() {
  const exportTypes = {};
  const currentDir = __dirname;
  
  try {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      // Look for export_*.js files (excluding index.js)
      if (file.startsWith("export_") && file.endsWith(".js")) {
        try {
          const exportType = require(path.join(currentDir, file));
          
          // Validate export type has required properties
          if (exportType.format && exportType.extension && exportType.description) {
            const typeName = file.replace("export_", "").replace(".js", "");
            exportTypes[typeName] = exportType;
          } else {
            console.warn(`Invalid export type: ${file} - missing required properties`);
          }
        } catch (err) {
          console.warn(`Failed to load export type: ${file} - ${err.message}`);
        }
      }
    });
  } catch (err) {
    console.error(`Failed to scan export-types directory: ${err.message}`);
  }
  
  return exportTypes;
}

/**
 * Get a specific export type by name
 * @param {string} typeName - The export type name (e.g., 'md', 'txt')
 * @returns {Object|null} Export type object or null if not found
 */
function getExportType(typeName) {
  const exportTypes = getAvailableExportTypes();
  return exportTypes[typeName] || null;
}

/**
 * Get list of supported export type names
 * @returns {string[]} Array of supported type names
 */
function getSupportedTypes() {
  return Object.keys(getAvailableExportTypes());
}

/**
 * Check if an export type is supported
 * @param {string} typeName - The export type name to check
 * @returns {boolean} True if supported, false otherwise
 */
function isTypeSupported(typeName) {
  return getSupportedTypes().includes(typeName);
}

module.exports = {
  getAvailableExportTypes,
  getExportType,
  getSupportedTypes,
  isTypeSupported
};