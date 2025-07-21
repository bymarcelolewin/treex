//======================================
// file: commands/export.js
// version: 2.0
// last updated: 20-01-2025
//======================================

const fs = require("fs");
const path = require("path");
const { getExportType, getSupportedTypes, isTypeSupported } = require("./export-types");

/**
 * Export tree data to multiple file formats
 * @param {string} treeString - The formatted tree string to export
 * @param {string} filename - Base filename without extension
 * @param {string[]} exportTypes - Array of export types (e.g., ['md', 'txt'])
 * @returns {Promise<Object>} Export results with completed and failed arrays
 */
async function exportToFiles(treeString, filename, exportTypes) {
  console.log('📤 Creating exports...');
  
  const results = {
    completed: [],
    failed: []
  };

  let chromiumError = null;
  const chromiumFormats = ['png', 'webp'];

  for (const type of exportTypes) {
    try {
      const success = await exportSingleFormat(treeString, filename, type);
      if (success) {
        results.completed.push(`${filename}.${type}`);
      } else {
        results.failed.push({ file: `${filename}.${type}`, error: "Export failed" });
      }
    } catch (error) {
      // Check if this is a Chromium error and we haven't seen it before
      const isChromiumError = error.message.includes('Chromium is required');
      
      if (isChromiumError && !chromiumError) {
        // Store the full Chromium error message once
        chromiumError = error.message;
        
        // Mark all Chromium-dependent formats as failed with simplified message
        const failedChromiumFormats = exportTypes.filter(t => chromiumFormats.includes(t));
        failedChromiumFormats.forEach(format => {
          if (!results.failed.find(f => f.file === `${filename}.${format}`)) {
            results.failed.push({ 
              file: `${filename}.${format}`, 
              error: "Requires Chromium (see message below)" 
            });
          }
        });
      } else if (!isChromiumError) {
        // Non-Chromium errors are added normally
        results.failed.push({ file: `${filename}.${type}`, error: error.message });
      }
    }
  }

  // Add the detailed Chromium error once at the end if needed
  if (chromiumError) {
    results.chromiumError = chromiumError;
  }

  return results;
}

/**
 * Export tree data to a single format
 * @param {string} treeString - The formatted tree string to export
 * @param {string} filename - Base filename without extension
 * @param {string} type - Export type (e.g., 'md', 'txt')
 * @returns {Promise<boolean>} Success status
 */
async function exportSingleFormat(treeString, filename, type) {
  // Get the export type module
  const exportType = getExportType(type);
  if (!exportType) {
    throw new Error(`Unsupported export type: ${type}`);
  }

  const fullFilename = `${filename}.${exportType.extension}`;
  
  // Check if file already exists
  if (fs.existsSync(fullFilename)) {
    throw new Error("File already exists");
  }

  // Format content using the export type's formatter (may be async)
  const content = await exportType.format(treeString);

  // Write file with appropriate encoding
  const encoding = exportType.binary ? null : "utf8";
  fs.writeFileSync(fullFilename, content, encoding);
  return true;
}


/**
 * Display export results to console
 * @param {Object} results - Export results with completed and failed arrays
 */
function displayResults(results) {
  console.log("\nExport Results:\n");

  if (results.completed.length > 0) {
    console.log("✅ Completed:");
    results.completed.forEach(file => {
      console.log(`  - ${file}`);
    });
  }

  if (results.failed.length > 0) {
    if (results.completed.length > 0) console.log("");
    console.log("❌ Failed:");
    results.failed.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
  }

  // Show detailed Chromium error message once at the end
  if (results.chromiumError) {
    console.log("\n" + results.chromiumError);
  }

  // Always show some result, even if everything succeeded
  if (results.completed.length === 0 && results.failed.length === 0) {
    console.log("ℹ️  No exports were processed.");
  }
}

module.exports = {
  exportToFiles,
  displayResults,
  getSupportedTypes,
  isTypeSupported
};