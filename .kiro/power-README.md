# Kiro Power Configuration

**Lesson 5: Powers**

Kiro Powers are packages that provide specialized tools, skills, and best practices that load dynamically when you mention matching keywords.

---

## What are Kiro Powers?

Powers are packages that extend Kiro's capabilities:
- **Skills**: Specialized knowledge domains (task management, API docs)
- **Tools**: MCP server tools or custom utilities
- **Context**: Relevant knowledge loaded on demand
- **Workflows**: Pre-defined patterns for common tasks

---

## Power Structure

A power is defined in `power.json` with:

```json
{
  "name": "power-name",
  "manifest": {
    "name": "Human readable name",
    "activation": { "keywords": ["keyword1", "keyword2"] },
    "skills": [...],
    "tools": [...]
  }
}
```

**Keywords** activate the power when you mention them in chat:
- "url" → activates `@url-shortener/todo`
- "shortener" → activates `@url-shortener/jsdoc`

---

## Powers Used in This Project

### 1. `@url-shortener/todo`

| Property | Value |
|----------|-------|
| **Activation Keywords** | `url`, `shortener`, `task` |
| **Skills** | task-management, progress-tracking |
| **Tools** | mark-complete, list-tasks, add-task |

**Purpose:** Track implementation tasks and monitor progress.

**Usage in Kiro:**
```
@url-shortener/todo list-tasks --status=all
@url-shortener/todo mark-complete --taskId=TASK-001
@url-shortener/todo add-task --description="Add redirect endpoint" --priority=high
```

---

### 2. `@url-shortener/jsdoc`

| Property | Value |
|----------|-------|
| **Activation Keywords** | `api`, `docs`, `documentation` |
| **Skills** | documentation, api-docs |
| **Tools** | generate-docs, validate-docs |

**Purpose:** Generate and validate API documentation.

**Usage in Kiro:**
```
@url-shortener/jsdoc generate-docs --inputDir=src/ --outputDir=docs/
@url-shortener/jsdoc validate-docs --strict=true
```

---

### 3. `@kiro/todo` (Built-in)

| Property | Value |
|----------|-------|
| **Activation Keywords** | `todo`, `task`, `tasks` |
| **Skills** | task-management |

**Purpose:** Built-in task tracking without extra configuration.

**Usage in Kiro:**
```
@kiro/todo show me pending tasks
@kiro/todo mark TASK-001 as complete
@kiro/todo add a high priority task
```

---

## How Powers Work

### 1. Activation
When you mention an activation keyword in chat, Kiro:
1. Searches for matching powers in your configuration
2. Loads the power's skills and tools into context
3. Makes the power's capabilities available

### 2. Usage
Powers can be invoked in two ways:

**Direct Invocation:**
```
@power-name tool-name --param1=value1
```

**Mention in Context:**
```
I'm building a URL shortener. @url-shortener/todo show me pending tasks.
```

### 3. Configuration
Powers are configured in `power.json` at the project root or in `~/.kiro/powers/` for user-level powers.

---

## Creating Custom Powers

### Power Directory Structure

```
~/.kiro/powers/my-power/
├── power.json           # Power configuration
├── skills/              # Skill definitions
│   └── my-skill.md
├── tools/               # Tool implementations
│   └── my-tool.js
└── steering/            # Power-specific steering
    └── custom-standards.md
```

### power.json Template

```json
{
  "name": "my-custom-power",
  "version": "1.0.0",
  "kiro": {
    "version": ">=1.0.0"
  },
  "manifest": {
    "name": "My Custom Power",
    "description": "Description of what this power does",
    "activation": {
      "keywords": ["keyword1", "keyword2"]
    },
    "skills": [
      {
        "name": "skill-name",
        "description": "What this skill provides"
      }
    ],
    "tools": [
      {
        "name": "tool-name",
        "description": "What this tool does",
        "parameters": {
          "type": "object",
          "properties": {
            "param1": {
              "type": "string",
              "description": "Parameter description"
            }
          }
        }
      }
    ]
  }
}
```

---

## Best Practices

1. **Descriptive Keywords**: Choose keywords you'll naturally use
2. **Clear Skill Names**: Skills should be self-explanatory
3. **Well-Documented Tools**: Parameters should have descriptions
4. **Focused Scope**: One power per concern
5. **Version Control**: Pin versions for reproducibility

---

## Common Powers

| Power | Description |
|-------|-------------|
| `@kiro/todo` | Built-in task tracking |
| `@kiro/jsdoc` | Generate JSDoc documentation |
| `@kiro/sql` | SQL query assistance |
| `@kiro/regex` | Regex pattern help |
| `@kiro/git` | Git workflow assistance |

---

## Example Workflow

```
User: "I need to track the progress of implementing redirect logic @url-shortener/todo what's left?"

Kiro (power activated): 
"Here are your pending tasks for redirect logic:
[TASK-005] Implement GET /:shortCode (redirect) - Medium priority
[TASK-010] Add redirect tests - Low priority"

User: "@url-shortener/todo mark TASK-005 complete"

Kiro: "Marked TASK-005 as complete. 1 task remaining."
```

---

## References

- [Kiro Powers Documentation](https://docs.kiro.dev/powers)
- [Power Registry](https://registry.kiro.dev)
- [Creating Custom Powers](https://docs.kiro.dev/creating-powers)