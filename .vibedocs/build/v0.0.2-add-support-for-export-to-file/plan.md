# v0.0.2 - Add Export to File Feature

## Project Metadata
| Field | Value |
|-------|-------|
| Version | v0.0.2 |
| Dependencies | v0.0.1 (base treex functionality) |
| Breaking Changes | No |

## Overview
Add the ability to export treex output to various file formats, starting with Markdown support.

## Requirements
- Export tree structure to files with suppressed console output
- Support multiple export formats simultaneously (starting with Markdown)
- Export multiple formats from single command
- Automatic file extension handling per format
- Preserve emoji icons in exported files
- Never overwrite existing files - return "file already exists" error
- Work with all existing flags (--collapsed, --folders-only, --details, etc.)
- For multiple format exports, show results in "Completed" and "Failed" sections
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
- When exporting: suppress console output, only show export results
- All existing flags (--collapsed, --folders-only, --details) work with export
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
  - File already exists (do NOT overwrite, return error)
  - Partial failures (some formats succeed, others fail)

### 3. Scan-Folder Updates (`commands/scan-folder.js`)
- Create new `getTreeString` function for export mode
- When exporting:
  - Generate formatted string instead of console output
  - Return formatted string for export module
  - Respect all existing flags (--collapsed, --folders-only, --details)
- Keep existing `printTree` function unchanged for normal console output

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

### 5. Error Handling & Output Format
- Validate export type is supported
- Check file write permissions before attempting writes
- Never overwrite existing files - return "file already exists" error
- For multiple format exports, display results in sections:

**Success Example:**
```
Export Results:

✅ Completed:
  - my-tree.md
  - my-tree.txt

❌ Failed:
  - my-tree.html: File already exists
```

**All Failed Example:**
```
Export Results:

❌ Failed:
  - my-tree.md: File already exists
  - my-tree.txt: Permission denied
```

### 6. Future Export Types

Text: 
- **txt**: Plain text
- **html**: Styled HTML with CSS
- **docx**: Microsoft Word document

Image:
- **png**: Portable Network Graphics
- **webp**: WebP image format

## Risk Assessment

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|-------------------|
| Complex CLI option parsing | Medium | Low | Use existing Commander.js patterns from codebase |
| File permission issues across platforms | High | Medium | Implement comprehensive permission checks before writing |
| Performance impact on large directories | Medium | Low | Reuse existing scan-folder logic, minimal overhead |
| Breaking existing CLI behavior | High | Low | Additive-only changes, no modification to existing options |
| Emoji rendering in different export formats | Low | Medium | Test emoji preservation, document limitations |

## Definition of Done

### Functional Requirements
- [ ] CLI accepts `--save-to` and `--export-as` options
- [ ] Markdown export generates properly formatted files
- [ ] Multiple formats can be exported simultaneously
- [ ] All existing flags work with export functionality
- [ ] Console output is suppressed during export
- [ ] Existing files are never overwritten

### Quality Requirements  
- [ ] Comprehensive error handling for all failure scenarios
- [ ] Clear success/failure reporting with specific error messages
- [ ] No performance regression on existing functionality
- [ ] Code follows existing patterns and conventions
- [ ] All edge cases tested (permissions, special characters, etc.)

### Technical Requirements
- [ ] No breaking changes to existing API
- [ ] New code integrates cleanly with existing modules
- [ ] Export functionality is modular and extensible
- [ ] File operations are atomic (all succeed or all fail gracefully)

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

## Related Documents
- [tasklist.md](./tasklist.md) - Detailed task breakdown and progress tracking
- [../../README.md](../../README.md) - Project overview and setup
- [../../commands/scan-folder.js](../../commands/scan-folder.js) - Core tree scanning logic
- [../../bin/treex.js](../../bin/treex.js) - CLI entry point

## Implementation Steps
1. Add CLI options to `bin/treex.js`
2. Create `commands/export.js` module
3. Modify `commands/scan-folder.js` for export support
4. Implement markdown export format
5. Add comprehensive error handling
6. Test all functionality and edge cases

## Success Metrics
- Feature works with all existing CLI flags without conflicts
- Export performance adds <100ms overhead for typical directories
- Zero breaking changes to existing functionality
- Clear, actionable error messages for all failure scenarios
- Documentation updated to reflect new capabilities