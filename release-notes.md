# TreeX Release Notes

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