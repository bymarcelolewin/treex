# v1.0.0 - Add Emoji Management Support

## Overview
Add CLI options for emoji management similar to the existing ignore file management system. Users can list, update, and restore emoji configurations.

## Features

### 1. List Current Emojis (`-le` / `--list-emojis`)
- Display all current emoji mappings in a user-friendly format
- Show emoji type and corresponding symbol
- Exit after displaying (similar to `-s` for ignored files)

### 2. Update Emoji (`-ue` / `--update-emoji`)
- Syntax: `treex -ue <type> <emoji>`
- Valid types: `folder`, `file`, `hidden`, `locked`, `permissionDenied`
- Only one emoji can be updated per command
- Validate that the provided type exists
- Update `config/emojis.json` with new emoji

### 3. Restore Default Emojis (`-re` / `--restore-emojis`)
- Reset all emojis back to original defaults
- Copy from `config/default-emojis.json` to `config/emojis.json`
- Confirm action completed to user

## Implementation Plan

### Phase 1: Setup Infrastructure
1. **Backup file already exists**: `config/emojis-default.json` already created
2. **Add CLI options**: Update `bin/treex.js` with new flags
3. **Create emoji management module**: `commands/emoji-management.js`

### Phase 2: Core Functionality
1. **List emojis function**: Display current emoji mappings
2. **Update emoji function**: Validate type and update JSON file
3. **Restore emojis function**: Copy from `emojis-default.json` back to `emojis.json`

### Phase 3: Integration & Testing
1. **Integrate with main CLI**: Route new flags to emoji management
2. **Add validation**: Ensure emoji types are valid
3. **Test all scenarios**: List, update, restore operations

### Phase 4: Documentation
1. **Update README**: Add emoji management section to Command Reference
2. **Add examples**: Show usage patterns for each flag
3. **Update help text**: Include new options in CLI help

## Technical Details

### File Structure
```
config/
├── emojis.json          # Active emoji configuration (user-modifiable)
├── emojis-default.json  # Original defaults (never modified) - already created
└── ignored-names.json   # Existing ignore configuration
```

### CLI Integration
```bash
# List current emojis
treex -le

# Update folder emoji
treex -ue folder "🗂️"

# Update file emoji  
treex -ue file "📋"

# Restore all defaults
treex -re
```

### Example Output
```bash
$ treex -le
Current Emoji Configuration:

📂 folder
📄 file
🫥 hidden
🔒 locked
🚫 permissionDenied
```

### Error Handling
- Invalid emoji type: Show valid options
- File system errors: Graceful error messages
- **Emoji validation**: Validate that the provided string is actually an emoji
  - Use regex to check if string contains emoji characters
  - Reject non-emoji strings like "sadfasf" 
  - Show error: "Invalid emoji. Please provide a valid emoji character."

## Success Criteria
- ✅ Users can list current emojis with `-le`
- ✅ Users can update individual emojis with `-ue type emoji`
- ✅ Users can restore defaults with `-re`
- ✅ All operations provide clear feedback
- ✅ Documentation updated with examples
- ✅ Error handling for invalid inputs