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
const { listEmojis, updateEmoji, restoreEmojis } = require("../commands/emoji-management");
const packageJson = require("../package.json");

const program = new Command();

program
  .name("treex")
  .description("TreeX v" + packageJson.version + "\nA cross-platform CLI for visualizing and exporting folder structures\nCreated by Marcelo Lewin from iCodeWith.ai.")
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
  .option("-le, --list-emojis", "List current emoji configuration and exit")
  .option("-ue, --update-emoji <type> <emoji>", "Update emoji for specified type (folder, file, hidden, locked, permissionDenied)")
  .option("-re, --restore-emojis", "Restore all emojis to default configuration")
  .option("-S, --save-to <filename>", "Export filename without extension")
  .option("-E, --export-as <types>", "Export format(s) - comma-separated (md, txt, etc.)")
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

    if (options.listEmojis) {
      listEmojis();
      return;
    }

    if (options.updateEmoji) {
      // Commander.js should handle the two arguments, but we need to extract them
      const args = process.argv.slice(2);
      const ueIndex = args.findIndex(arg => arg === '-ue' || arg === '--update-emoji');
      if (ueIndex !== -1 && args[ueIndex + 1] && args[ueIndex + 2]) {
        const type = args[ueIndex + 1];
        const emoji = args[ueIndex + 2];
        updateEmoji(type, emoji);
      } else {
        console.error("Error: --update-emoji requires both type and emoji arguments");
        console.error("Usage: treex -ue <type> <emoji>");
        console.error("Valid types: folder, file, hidden, locked, permissionDenied");
        process.exit(1);
      }
      return;
    }

    if (options.restoreEmojis) {
      restoreEmojis();
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

      // Export to files (async)
      exportToFiles(treeString.trim(), options.saveTo, exportTypes)
        .then(results => {
          // Display results
          displayResults(results);
        })
        .catch(error => {
          console.error(`Export error: ${error.message}`);
          process.exit(1);
        });
      return;
    }

    const resolvedPath = path.resolve(process.cwd(), dir);

    printTree(resolvedPath, "", true, options.details || false, {
      collapsed: options.collapsed || false,
      foldersOnly: options.foldersOnly || false
    });
  });

program.parse(process.argv);