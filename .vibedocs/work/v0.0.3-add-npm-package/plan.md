# v0.0.3 - NPM Package Publication Plan

## Project Metadata
| Field | Value |
|-------|-------|
| Version | v0.0.3 |
| Dependencies | v0.0.2 (export functionality) |
| Breaking Changes | No |

## Overview
Transform TreeX from a development-only tool into a published npm package that users can install globally via `npm install -g treex`.

## Current State Analysis

### ✅ What's Already Working
- **Functional CLI**: Complete working tool with rich feature set
- **Proper bin configuration**: `bin/treex.js` with correct shebang
- **Module structure**: Clean separation of concerns across commands/
- **Export functionality**: 4 export formats (MD, SVG, PNG, WebP) with emoji support
- **Error handling**: Comprehensive error management and user feedback
- **Documentation**: Excellent README with examples and usage instructions

### 🔧 Package.json Current State
```json
{
  "name": "treex",
  "version": "0.0.2", 
  "description": "A cross-platform CLI to perform a variety of utilities",
  "main": "bin/treex.js",
  "bin": { "treex": "./bin/treex.js" },
  "dependencies": {
    "commander": "^11.1.0",
    "module-alias": "^2.2.3", 
    "puppeteer": "^24.14.0"
  }
}
```

## NPM Package Requirements

### 1. Package Name Strategy
**Current Issue**: `treex` may be taken on npm registry

**Options**:
- `@icodewith-ai/treex` (scoped package - recommended)
- `treex-cli` (if treex is taken)
- `tree-visualizer`
- Check availability first

### 2. Package.json Enhancements

#### Required Fields
```json
{
  "name": "@icodewith-ai/treex",
  "version": "0.0.2",
  "description": "Advanced tree structure visualizer & exporter with emoji support",
  "main": "bin/treex.js",
  "bin": {
    "treex": "./bin/treex.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "release:patch": "npm version patch && npm publish && git push && git push --tags && git checkout dev && git merge main && git push",
    "release:minor": "npm version minor && npm publish && git push && git push --tags && git checkout dev && git merge main && git push",
    "release:major": "npm version major && npm publish && git push && git push --tags && git checkout dev && git merge main && git push"
  },
  "files": [
    "bin/",
    "commands/",
    "config/",
    "README.md",
    "LICENSE"
  ],
  "keywords": [
    "cli",
    "tree",
    "directory",
    "visualization", 
    "export",
    "svg",
    "png",
    "markdown",
    "emoji"
  ],
  "author": {
    "name": "Marcelo Lewin",
    "url": "https://icodewith.ai"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/icodewith-ai/treex.git"
  },
  "homepage": "https://icodewith.ai",
  "bugs": {
    "url": "https://github.com/icodewith-ai/treex/issues"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### 3. File Inclusion Strategy
**Problem**: Current package includes development files

**Solution**: Use `files` array to include only necessary files:
- `bin/` - CLI executable
- `commands/` - Core functionality 
- `config/` - Configuration files
- `README.md` - Documentation
- `LICENSE` - Legal

**Exclude**: 
- `node_modules/`
- `.vibedocs/`
- Development files
- `.git/`

### 4. Dependency Optimization

#### Production Dependencies (keep as-is)
- `commander@^11.1.0` - CLI framework (small, essential)
- `module-alias@^2.2.3` - Clean imports (small, essential)
- `puppeteer@^24.14.0` - Heavy but necessary for PNG/WebP exports

#### Potential Optimizations
- **Puppeteer**: Largest dependency (~200MB) but required for image exports
- Consider `puppeteer-core` + separate Chromium detection
- Document system requirements clearly

### 5. Pre-publication Checklist

#### Code Quality
- [ ] All file paths use proper path.join() or path.resolve()
- [ ] Error handling covers all failure scenarios
- [ ] No hardcoded paths or platform-specific code
- [ ] Cross-platform compatibility verified

#### Package Structure  
- [ ] Check npm name availability
- [ ] Files array includes only necessary files
- [ ] Proper semver versioning
- [ ] All metadata fields completed

#### Testing
- [ ] Test installation on clean system
- [ ] Verify global install works: `npm install -g .`
- [ ] Test all CLI commands and options
- [ ] Test all export formats
- [ ] Cross-platform testing (Windows, macOS, Linux)

#### Documentation
- [ ] Installation instructions for npm
- [ ] Global vs local installation notes
- [ ] System requirements (Node.js version, Chromium for images)
- [ ] Troubleshooting section

## Implementation Plan

### Phase 1: Package Preparation
1. **Name Verification**
   - Check npm registry for availability
   - Reserve name if available
   - Choose scoped alternative if needed

2. **Package.json Enhancement**
   - Add all required metadata fields
   - Set proper version to 0.0.3
   - Configure files array
   - Add repository and homepage URLs

3. **File Organization**
   - Verify all included files are necessary
   - Remove any development-only files from package
   - Test that package works with only included files

### Phase 2: Pre-Publication Testing
1. **Local Testing**
   ```bash
   # Test package locally
   npm pack
   npm install -g treex-0.0.3.tgz
   treex --help
   treex ./test-directory -E "svg,md" -S test-export
   ```

2. **Clean Environment Testing**
   - Test on system without development dependencies
   - Verify Puppeteer downloads Chromium correctly
   - Test all export formats work

3. **Cross-Platform Verification**
   - Test on Windows, macOS, Linux if possible
   - Verify emoji rendering across platforms
   - Check file path handling

### Phase 3: Publication
1. **npm Registry Setup**
   - Configure npm account/organization
   - Set up 2FA for security
   - Configure publishing permissions

2. **Release Process**
   The package includes automated release scripts:
   - `npm run release:patch` → 0.0.2 → 0.0.3 (bug fixes)
   - `npm run release:minor` → 0.0.2 → 0.1.0 (new features)
   - `npm run release:major` → 0.0.2 → 1.0.0 (breaking changes)
   
   For this v0.0.3 release, use: `npm run release:patch`

3. **Post-Publication Verification**
   - Install from npm registry: `npm install -g @icodewith-ai/treex`
   - Test basic functionality
   - Verify package page looks correct

### Phase 4: Documentation Updates
1. **README Updates**
   - Update installation instructions to use npm
   - Remove development setup instructions from user section
   - Add system requirements
   - Update examples to use installed command

2. **Package Metadata**
   - Ensure description is compelling
   - Keywords optimize for discoverability
   - Links all work correctly

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Package name taken | Medium | High | Use scoped package @icodewith-ai/treex |
| Puppeteer install issues | High | Medium | Clear docs, fallback to SVG-only mode |
| Cross-platform incompatibility | High | Low | Thorough testing, path.join() usage |
| Large package size | Medium | High | Document requirements, optimize if possible |
| Publishing permissions | Low | Low | Set up npm organization properly |

## Success Metrics

### Technical Requirements
- Package installs successfully with `npm install -g`
- All existing functionality works after global install
- Package size under 300MB (including Puppeteer)
- Compatible with Node.js 14+

### User Experience
- One-command installation
- Clear error messages for system requirement issues  
- Comprehensive documentation
- Easy discovery through npm search

### Maintenance
- Automated testing setup for future releases
- Clear contribution guidelines
- Semantic versioning strategy
- Update process documented

## Post-Publication Roadmap

### v0.0.4 Considerations
- Optional Puppeteer dependency (lighter core package)
- Plugin system for export formats
- Performance optimizations
- Additional export formats

### Long-term Strategy
- TypeScript migration for better maintainability
- CI/CD pipeline for automated testing and publishing
- Community contributions workflow
- Feature request management

## Definition of Done

### Functional Requirements
- [ ] Package published successfully to npm
- [ ] Global installation works: `npm install -g @icodewith-ai/treex`
- [ ] All CLI commands function identically to development version
- [ ] All export formats work correctly
- [ ] Cross-platform compatibility verified

### Quality Requirements
- [ ] Package metadata complete and professional
- [ ] Documentation updated for npm installation
- [ ] Error handling covers npm-specific scenarios
- [ ] Performance acceptable with global installation
- [ ] Security best practices followed

### Business Requirements
- [ ] Package discoverable through relevant keywords
- [ ] Professional presentation on npm registry
- [ ] Clear value proposition in description
- [ ] Proper attribution and licensing
- [ ] Contact information for support

## Files to Modify

### New Files
- None required - structure is already correct

### Modified Files
- `package.json` - Complete metadata enhancement
- `README.md` - Update installation instructions
- `.npmignore` - Control published files (alternative to files array)

### Repository Setup
- Ensure GitHub repository is public and accessible
- Add issue templates
- Configure repository settings for npm integration

## Next Steps After This Plan
1. Execute Phase 1: Package preparation
2. Thorough testing in clean environments  
3. Publication to npm registry
4. Community announcement and feedback collection
5. Monitor for issues and iterate quickly

This plan transforms TreeX from a development project into a professional, distributable npm package while maintaining all existing functionality and adding the professional polish expected from published packages.