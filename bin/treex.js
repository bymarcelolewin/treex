#!/usr/bin/env node

//======================================
// file: bin/treex.js
// version: 1.6
// last updated: 06-04-2025
//======================================

const { Command } = require("commander");
const path = require("path");
const printTree = require("../commands/scan-folder");
const { showIgnoredFiles, addIgnoredFiles, removeIgnoredFiles } = require("../commands/ignored-files");

const program = new Command();

program
  .name("treex")
  .description("🌲 TreeX — A cross-platform CLI for visualizing folder structures")
  .version("1.0.0");

program
program
  .argument("[dir]", "Directory to scan", ".")
  .option("-d, --details", "Show extra details like locked files")
  .option("-c, --collapsed", "Only show top-level folders/files (non-recursive)")
  .option("-f, --folders-only", "Show only folders recursively, omit files")
  .option("-s, --show-ignored", "List currently ignored files/folders and exit")
  .option("-a, --add-ignored <items>", "Comma-separated names to add to ignored list")
  .option("-r, --remove-ignored <items>", "Comma-separated names to remove from ignored list")
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

    const resolvedPath = path.resolve(process.cwd(), dir);

    printTree(resolvedPath, "", true, options.details || false, {
      collapsed: options.collapsed || false,
      foldersOnly: options.foldersOnly || false
    });
  });

program.parse(process.argv);