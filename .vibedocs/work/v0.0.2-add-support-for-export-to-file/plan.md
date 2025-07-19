# v0.0.2 - Add Export to File Feature

## Overview
Add the ability to export treex output to various file formats, starting with Markdown support.

## Requirements
- Export tree structure to files without console output
- Support multiple export formats simultaneously (starting with Markdown)
- Export multiple formats from single command
- Automatic file extension handling per format
- Preserve emoji icons in exported files
- Proper error handling for file operations

## CLI Design

### New Options
- `--save-to <filename>` - Specify output filename (without extension)
- `--export-as <types>` - Export format(s) - comma-separated (md, txt, etc.)

### Example Usage
```bash
treex --export-as md --save-to my-tree                    # Creates my-tree.md
treex --export-as "md,txt" --save-to project-structure    # Creates project-structure.md and project-structure.txt
treex /path/to/folder --export-as "md,txt,html" --save-to folder-tree  # Multiple formats
treex --export-as txt --save-to simple-tree               # Creates simple-tree.txt
```

## Implementation Plan

### 1. CLI Updates (`bin/treex.js`)
- Add new command line options:
  - `--save-to <filename>` - Filename without extension
  - `--export-as <types>` - Comma-separated export formats
- Parse comma-separated export types into array
- Validate that both options are provided when exporting
- Validate that all requested export types are supported
- Pass export configuration to scan-folder module

### 2. Export Module (`commands/export.js`)
- Create new module to handle file exports
- Support multiple export formats simultaneously:
  - **Markdown**: Tree in code block with emojis preserved
  - **Text**: Plain text format (future)
  - **HTML**: Styled HTML (future)
- Generate multiple files from single tree data
- Handle file extension auto-addition for each format
- Implement error handling for:
  - File permission issues
  - Invalid paths
  - Disk space problems
  - File already exists (overwrite for each format)
  - Partial failures (some formats succeed, others fail)

### 3. Scan-Folder Updates (`commands/scan-folder.js`)
- Modify `printTree` function to support export mode
- When exporting:
  - Capture output instead of printing to console
  - Return formatted string for export module
- Add export mode parameter to control behavior

### 4. Markdown Export Format
```markdown
# Directory Structure

\`\`\`
📂 treex
├── 📂 bin
│   └── 📄 treex.js
├── 📂 commands
│   ├── 📄 export.js
│   ├── 📄 ignored-files.js
│   └── 📄 scan-folder.js
└── 📄 package.json
\`\`\`
```

### 5. Error Handling
- Validate export type is supported
- Check file write permissions
- Handle filename conflicts
- Provide clear error messages
- Graceful fallback behavior

### 6. Future Export Types
- **txt**: Plain text without emojis
- **html**: Styled HTML with CSS
- **docx**: Microsoft Word document
- **json**: Structured data format

## File Structure Changes
```
commands/
├── export.js          # New export functionality
├── ignored-files.js   # Existing
└── scan-folder.js     # Modified to support export mode
```

## Testing Plan
1. Test basic markdown export functionality
2. Test filename handling and auto-extension
3. Test error scenarios (permissions, invalid paths)
4. Test with various directory structures
5. Test integration with existing flags (--collapsed, --folders-only, etc.)

## Implementation Steps
1. Add CLI options to `bin/treex.js`
2. Create `commands/export.js` module
3. Modify `commands/scan-folder.js` for export support
4. Implement markdown export format
5. Add comprehensive error handling
6. Test all functionality and edge cases