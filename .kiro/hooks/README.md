# Kiro Hooks Configuration

**Lesson 3: Hooks**

This folder contains Kiro hooks that automate actions based on events in your IDE session.

---

## Overview

Hooks are JSON files that specify:
- **trigger**: When the hook fires (e.g., PostFileSave, PreToolUse)
- **matcher**: Optional regex to filter which files/events trigger the hook
- **action**: What to do (run a command or invoke an agent prompt)

---

## Hooks in This Project

### 1. `lint-on-save.json`

| Property | Value |
|----------|-------|
| **Trigger** | `PostFileSave` |
| **Matcher** | `\.(js|mjs)$` |
| **Action** | Run `npm run lint` |

**Purpose:** Automatically lint JavaScript files when saved, catching code quality issues early.

**When it fires:** Every time you save a `.js` or `.mjs` file in the project.

---

### 2. `test-on-save.json`

| Property | Value |
|----------|-------|
| **Trigger** | `PostFileSave` |
| **Matcher** | `src/.*\.js$` |
| **Action** | Run `npm run test:unit` |

**Purpose:** Run unit tests automatically when source files change to catch regressions immediately.

**When it fires:** Every time you save a file in the `src/` directory.

---

### 3. `write-review.json`

| Property | Value |
|----------|-------|
| **Trigger** | `PreToolUse` |
| **Matcher** | `fs_write\|str_replace\|fs_append` |
| **Action** | Agent review prompt |

**Purpose:** Review file write operations before they happen to ensure code follows project standards.

**When it fires:** Before any file write operation.

**Exit Code Behavior:**
- `0`: Operation proceeds (agent returned "APPROVED")
- `2`: Operation is blocked (agent returned issues)
- Other: Silent failure, operation proceeds

---

## Adding New Hooks

To add a new hook, create a new `.json` file in this folder:

```json
{
  "version": "v1",
  "hooks": [{
    "name": "Hook Name",
    "description": "What this hook does",
    "trigger": "PostFileSave",
    "matcher": "\\.js$",
    "action": {
      "type": "command",
      "command": "npm run lint"
    }
  }]
}
```

## Available Triggers

| Trigger | Description |
|---------|-------------|
| `PreToolUse` | Before a tool is executed |
| `PostToolUse` | After a tool is executed |
| `PostFileSave` | When a file is saved |
| `PostFileCreate` | When a new file is created |
| `PostFileDelete` | When a file is deleted |
| `SessionStart` | When a new session begins |
| `UserPromptSubmit` | When user submits a message |

## Action Types

### Command Action
Runs a shell command:
```json
"action": {
  "type": "command",
  "command": "npm run lint",
  "timeout": 60
}
```

### Agent Action
Invokes an agent prompt:
```json
"action": {
  "type": "agent",
  "prompt": "Review this code for security issues..."
}
```

---

## Best Practices

1. **Keep hooks focused** - One hook per concern
2. **Use matchers wisely** - Only trigger on relevant files
3. **Set reasonable timeouts** - Don't block too long
4. **Test your hooks** - Verify they work as expected
5. **Document clearly** - Explain what each hook does