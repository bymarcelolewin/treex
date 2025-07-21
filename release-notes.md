# TreeX Release Notes

## v1.0.1 - Enhanced CLI Styling

### 🎨 Visual Enhancements
- **NEW: Styled ASCII Banner** - TreeX now displays as large green ASCII art using Figlet
- **Colored Command Interface** - All command flags appear in green for easy identification
- **Professional Help Output** - Clean white text for descriptions and help content
- **Cross-Platform Colors** - Automatic color detection with graceful fallback for terminals without color support

### 🔧 Technical Implementation
- **Added Figlet dependency** - ASCII art text generation for stylized headers
- **Added Chalk dependency (v4.1.2)** - Terminal text styling and colorization with CommonJS compatibility
- **Custom help formatter** - Built specifically for Commander.js with proper styling integration
- **Smart color handling** - Respects NO_COLOR environment variable for accessibility

### 🎯 User Experience
```bash
# The new styled help interface
treex --help
# Shows beautiful green ASCII banner with colored command options
```

### 📚 Documentation Updates
- **Updated README** with new dependencies (figlet, chalk)
- **Enhanced Quick Start** section with styled help example
- **Updated project structure** documentation to reflect new CLI styling module

This release focuses on improving the visual appeal and professional appearance of TreeX while maintaining full functionality and compatibility across all supported platforms.

---

## v1.0.0 - Emoji Management System

### 🎨 NEW: Emoji Customization
- **List current emojis** with `-le` flag - see all configured emoji types and symbols
- **Update individual emojis** with `-ue <type> <emoji>` - customize folder, file, hidden, locked, and permissionDenied emojis
- **Restore default emojis** with `-re` flag - reset all customizations back to original settings
- **Emoji validation** - prevents invalid characters, only accepts actual emoji symbols
- **Error handling** - clear messages for invalid emoji types and non-emoji input

### 🔧 Technical Implementation  
- **New emoji management module** (`commands/emoji-management.js`) with full CRUD operations
- **Backup system** - `config/emojis-default.json` preserves original emoji configuration
- **CLI integration** - seamless addition to existing command structure
- **Type validation** - ensures only valid emoji types can be updated
- **Regex-based emoji validation** - robust checking for actual emoji characters

### 📚 Documentation Updates
- **Comprehensive README updates** with new Emoji Management Options section
- **Usage examples** for all three new emoji management commands
- **CLI help integration** - all new options automatically appear in `--help` output

### 🎯 User Experience
```bash
# Quick emoji management examples
treex -le                    # List current emoji configuration  
treex -ue folder "🗂️"       # Update folder emoji
treex -ue file "📋"         # Update file emoji
treex -re                    # Restore all defaults
```

This major release introduces the first customization system to TreeX, allowing users to personalize their tree output while maintaining the reliability and functionality of existing features.

---

## v0.0.7 - Disabled Image Exports on Linux

### 🐧 Linux Changes
- **Disabled image exports** (PNG, WebP, SVG) on Linux due to architecture compatibility issues
- **Markdown export** remains fully supported on all platforms including Linux
- **Clear error messages** when attempting image exports on Linux

## v0.0.6 - Architecture Support Improvements

### 🔧 Technical Fixes
- **Enhanced error handling** for ARM-based Linux systems
- **Better architecture detection** and user guidance
- **Improved Chromium installation messages**

## v0.0.5 - Fixed Linux Export Issues

### 🐛 Bug Fixes
- **Fixed duplicate error messages** when multiple Chromium-dependent formats (PNG + WebP) fail
- **Enhanced result display** to always show both successful and failed exports
- **Improved error grouping** with single detailed Chromium installation message

## v0.0.4 - Enhanced Linux Support

### 🐧 Linux Improvements
- **Friendly error messages** for missing Chromium on Linux systems
- **Clear installation guidance** with sudo instructions for Linux users
- **Updated documentation** with Linux-specific installation notes

## v0.0.3 - NPM Package & Enhancements

### 📦 NPM Package Publication
- **NEW**: TreeX is now available on NPM! Install globally with:
  ```bash
  npm install -g @icodewith-ai/treex
  ```
- **Enhanced** package metadata with proper repository links, keywords, and homepage
- **Added** automated release scripts for patch/minor/major versioning

### 🎯 User Experience Improvements

#### Export Process Feedback
- **NEW**: Clear "📤 Creating exports..." message when using `-E` flag
- **Improved**: Better user awareness during export operations

#### Advanced File Filtering
- **NEW**: Glob pattern support for ignored files
  ```bash
  # Now works! Before v0.0.3, this only matched exactly "test*.*"
  treex -a "test*.*"     # Matches test1.txt, test2.js, test_file.log, etc.
  treex -a "*.tmp"       # Matches all .tmp files
  treex -a "temp?.log"   # Matches temp1.log, tempa.log, etc.
  ```
- **Enhanced**: Case-insensitive pattern matching
- **Maintained**: Backward compatibility with exact string matches

### 📚 Documentation & Support

- **Updated**: Updated readme.md file
- **Added**: Added release notes.

### 🔧 NPM Package Configuration

#### Release Management
```json
{
  "release:patch": "npm version patch && npm publish && git push...",
  "release:minor": "npm version minor && npm publish && git push...",
  "release:major": "npm version major && npm publish && git push..."
}
```

## v0.0.2 - Export System (Previous)

### Export Functionality
- Multi-format export system (MD, SVG, PNG, WebP)
- Puppeteer-based image rendering with color emoji support  
- Dynamic SVG sizing and content-aware width calculation
- Comprehensive error handling and user feedback

### Core Features
- Tree structure visualization with emoji icons
- Configurable ignore lists for files and folders
- Cross-platform CLI with detailed options
- Professional console output with colors and formatting