#!/usr/bin/env node

//======================================
// file: bin/treex.js
// version: 1.6
// last updated: 06-04-2025
//======================================

const { Command } = require("commander");
const path = require("path");
const printTree = require("../commands/scan-folder");
const { getTreeString } = require("../commands/scan-folder");
const { showIgnoredFiles, addIgnoredFiles, removeIgnoredFiles } = require("../commands/ignored-files");
const { exportToFiles, displayResults, getSupportedTypes } = require("../commands/export");
const packageJson = require("../package.json");

const program = new Command();

program
  .name("treex")
  .description("🌲 TreeX — A cross-platform CLI for visualizing folder structures")
  .version(packageJson.version);

program
program
  .argument("[dir]", "Directory to scan", ".")
  .option("-d, --details", "Show extra details like locked files")
  .option("-c, --collapsed", "Only show top-level folders/files (non-recursive)")
  .option("-f, --folders-only", "Show only folders recursively, omit files")
  .option("-s, --show-ignored", "List currently ignored files/folders and exit")
  .option("-a, --add-ignored <items>", "Comma-separated names to add to ignored list")
  .option("-r, --remove-ignored <items>", "Comma-separated names to remove from ignored list")
  .option("--save-to <filename>", "Export filename without extension")
  .option("--export-as <types>", "Export format(s) - comma-separated (md, txt, etc.)")
  .action((dir, options) => {
    if (options.showIgnored) {
      showIgnoredFiles();
      return;
    }

    if (options.addIgnored) {
      const names = options.addIgnored.split(",").map(x => x.trim());
      addIgnoredFiles(names);
      return;
    }

    if (options.removeIgnored) {
      const names = options.removeIgnored.split(",").map(x => x.trim());
      removeIgnoredFiles(names);
      return;
    }

    // Handle export functionality
    if (options.saveTo || options.exportAs) {
      // Validate that both options are provided together
      if (!options.saveTo || !options.exportAs) {
        console.error("Error: Both --save-to and --export-as options must be provided together");
        process.exit(1);
      }

      // Parse export types into array
      const exportTypes = options.exportAs.split(",").map(type => type.trim().toLowerCase());

      // Validate export types are supported
      const supportedTypes = getSupportedTypes();
      const unsupportedTypes = exportTypes.filter(type => !supportedTypes.includes(type));
      if (unsupportedTypes.length > 0) {
        console.error(`Error: Unsupported export type(s): ${unsupportedTypes.join(", ")}`);
        console.error(`Supported types: ${supportedTypes.join(", ")}`);
        process.exit(1);
      }

      // Generate tree string for export
      const resolvedPath = path.resolve(process.cwd(), dir);
      const treeString = getTreeString(resolvedPath, "", true, options.details || false, {
        collapsed: options.collapsed || false,
        foldersOnly: options.foldersOnly || false
      });

      // Export to files
      const results = exportToFiles(treeString.trim(), options.saveTo, exportTypes);
      
      // Display results
      displayResults(results);
      return;
    }

    const resolvedPath = path.resolve(process.cwd(), dir);

    printTree(resolvedPath, "", true, options.details || false, {
      collapsed: options.collapsed || false,
      foldersOnly: options.foldersOnly || false
    });
  });

program.parse(process.argv);