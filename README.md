# treex - Tree Structure Visualizer

🌲 TreeX is a cross-platform CLI tool for visualizing folder structures with emoji-based output. It recursively displays directory trees in an easy-to-read format with various customization options.

## What treex does

TreeX scans directories and displays their structure using:
- 📂 Folder icons for directories  
- 📄 File icons for regular files
- 🕶️ Special icons for hidden files (starting with .)
- 🔒 Lock icons for files without write permissions (with --details)

### Example Output
```
📂 treex
├── 📂 bin
│   └── 📄 treex.js
├── 📂 commands
│   ├── 📄 ignored-files.js
│   └── 📄 scan-folder.js
├── 📂 config
│   ├── 📄 emojis.json
│   └── 📄 ignored-names.json
├── 🕶️ .gitignore
├── 📄 package-lock.json
├── 📄 package.json
└── 📄 README.md
```

## Usage

```bash
treex [directory] [options]

# Scan current directory
treex

# Scan specific directory  
treex /path/to/folder

# Show only top-level items (non-recursive)
treex -c

# Show only folders, no files
treex -f

# Show file permissions and locked files
treex -d

# Manage ignored files/folders
treex -s                           # Show currently ignored items
treex -a "node_modules,.git"       # Add items to ignore list
treex -r "temp"                    # Remove items from ignore list
```

## Project Structure

This is a Node.js CLI application built with:
- **Commander.js** for command-line interface and argument parsing
- **Module aliases** for clean imports using `@ignored` and `@emojis`
- **Emoji-based icons** for visual appeal and file type identification
- **Configurable ignore lists** for filtering unwanted files/folders

## Key Files

- `bin/treex.js` - Main CLI entry point with Commander.js setup
- `commands/scan-folder.js` - Core recursive directory scanning logic
- `commands/ignored-files.js` - Manage ignored files/folders list
- `config/emojis.json` - Emoji mappings for different file types
- `config/ignored-names.json` - List of files/folders to ignore by default

## Development

### Running the CLI
```bash
npm link  # To install globally for development
treex --help
```

## About
Create by Marcelo Lewin from [iCodeWith.ai](https://icodewith.ai)