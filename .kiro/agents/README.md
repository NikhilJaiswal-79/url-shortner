# Custom Agents Configuration

**Lesson 7: Custom Agents**

Custom agents are specialized Kiro configurations with customized tools, permissions, context, and instructions.

---

## What are Custom Agents?

Custom agents are purpose-built configurations that:
- Have specialized knowledge and instructions
- Can be restricted from certain tools (read-only reviewers)
- Have access to specific MCP servers
- Can use custom steering files
- Can have different behavior than the default agent

---

## Agent Structure

```json
{
  "name": "agent-name",
  "version": "1.0.0",
  "description": "What this agent does",
  "model": "mini-max",
  "systemPrompt": "Specialized instructions for this agent",
  "contextFiles": ["path/to/context.md"],
  "tools": {
    "allowed": ["read_file", "list_directory"],
    "denied": ["fs_write", "delete_file"]
  },
  "mcpServers": ["server-name"],
  "hooks": ["hook-file.json"],
  "preferences": {
    "autoApprove": false,
    "requireConfirmation": true,
    "timeoutSeconds": 120
  }
}
```

---

## Agents in This Project

### code-reviewer

| Property | Value |
|----------|-------|
| **Name** | code-reviewer |
| **Purpose** | Read-only code reviews with security focus |
| **Model** | mini-max |
| **System Prompt** | Node.js/Express code review specialist |

**Permissions:**

| Tool Type | Allowed | Denied |
|-----------|---------|--------|
| read_file | ✅ Yes | |
| list_directory | ✅ Yes | |
| grep_search | ✅ Yes | |
| fs_write | | ❌ No |
| delete_file | | ❌ No |

**MCP Access:**
- `url-validator` - Validate URLs in code
- `rest-api-tools` - Test API endpoints

**Hooks Active:**
- `lint-on-save.json` - Auto-lint on save
- `test-on-save.json` - Auto-test on save

---

## How to Use Custom Agents

### Method 1: Command Palette
1. Open Command Palette (Ctrl+Shift+P)
2. Search "Kiro: Switch Agent"
3. Select the agent

### Method 2: Direct Invocation
```
@code-reviewer review the code in src/routes/urls.js
```

### Method 3: Session Start
Mention the agent name when starting a session:
```
I want to work with the code-reviewer agent
```

---

## Creating Custom Agents

### Step 1: Create Agent File

Create `.kiro/agents/agent-name.json`:

```json
{
  "name": "my-custom-agent",
  "version": "1.0.0",
  "description": "Description of what this agent does",
  "model": "mini-max",
  "systemPrompt": "Your specialized instructions here...",
  "contextFiles": [],
  "tools": {
    "allowed": ["read_file", "list_directory"],
    "denied": []
  },
  "mcpServers": [],
  "hooks": []
}
```

### Step 2: Define System Prompt

The system prompt defines the agent's behavior:

```
You are a security specialist. Always check for:
1. SQL injection vulnerabilities
2. XSS attacks
3. Authentication bypasses
4. Sensitive data exposure

Never approve code with security issues.
```

### Step 3: Configure Tool Access

Control what the agent can do:

```json
"tools": {
  "allowed": ["read_file", "read_code", "grep_search", "list_directory"],
  "denied": ["fs_write", "str_replace", "delete_file", "fs_append"]
}
```

**Available Tools:**
- `read_file` - Read file contents
- `read_code` - Analyze code files
- `write_file` - Create/overwrite files
- `str_replace` - Edit file contents
- `fs_append` - Append to files
- `delete_file` - Delete files
- `grep_search` - Search in files
- `list_directory` - List directory contents
- `file_search` - Find files by pattern
- `execute_pwsh` - Run shell commands
- `invoke_sub_agent` - Call sub-agents
- `smart_relocate` - Move/rename files

### Step 4: Add MCP Servers

Restrict which MCP servers the agent can use:

```json
"mcpServers": ["url-validator", "rest-api-tools"]
```

### Step 5: Add Context Files

Include steering files for domain knowledge:

```json
"contextFiles": [
  ".kiro/steering/project-standards.md",
  ".kiro/steering/security-guidelines.md"
]
```

---

## Example Custom Agents

### 1. Security Auditor

```json
{
  "name": "security-auditor",
  "description": "Security-focused code reviewer",
  "systemPrompt": "You are a security auditor. Audit every line of code for:\n- SQL injection\n- XSS vulnerabilities\n- Authentication flaws\n- Data exposure risks\nReport findings with severity levels.",
  "tools": {
    "allowed": ["read_file", "grep_search"],
    "denied": ["fs_write", "delete_file", "fs_append"]
  },
  "mcpServers": ["security-scanner"],
  "preferences": {
    "autoApprove": false,
    "requireConfirmation": false
  }
}
```

### 2. Documentation Agent

```json
{
  "name": "documentation-agent",
  "description": "Generates and updates documentation",
  "systemPrompt": "You are a technical writer. Focus on:\n- Clear explanations\n- Code examples\n- API documentation\n- README completeness",
  "tools": {
    "allowed": ["read_file", "fs_write", "list_directory"],
    "denied": ["delete_file"]
  },
  "contextFiles": [".kiro/steering/api-standards.md"]
}
```

### 3. Test Engineer

```json
{
  "name": "test-engineer",
  "description": "Focuses on writing and improving tests",
  "systemPrompt": "You are a test engineer. Prioritize:\n- High coverage\n- Edge cases\n- Property-based testing\n- Integration tests",
  "tools": {
    "allowed": ["read_file", "fs_write", "execute_pwsh"],
    "denied": []
  },
  "preferences": {
    "requireConfirmation": true
  }
}
```

---

## Agent Best Practices

### 1. Clear Purpose
Give agents a single, focused purpose:
```
✅ "Security auditor for Node.js code"
❌ "Do everything"
```

### 2. Specific System Prompts
Be explicit about behavior:
```
✅ "Always check for SQL injection in query methods"
❌ "Write good code"
```

### 3. Restrict Dangerous Tools
For read-only agents:
```json
"tools": {
  "allowed": ["read_file", "list_directory"],
  "denied": ["fs_write", "delete_file", "smart_relocate"]
}
```

### 4. Use MCP Selectively
Only allow relevant MCP servers:
```json
"mcpServers": ["security-scanner"]
```

### 5. Set Timeouts
Prevent runaway processes:
```json
"preferences": {
  "timeoutSeconds": 120
}
```

---

## Agent Precedence

When multiple agents match:
1. User-specified agent (e.g., `@code-reviewer`)
2. Activated by keywords in the prompt
3. Default agent as fallback

---

## Troubleshooting

### Agent Not Appearing
1. Verify JSON syntax is valid
2. Check agent file is in `.kiro/agents/`
3. Restart Kiro IDE

### Agent Can't Access Tools
1. Check `tools.allowed` includes the tool
2. Verify tool name matches exactly
3. Check `tools.deny` list

### Agent Missing MCP Tools
1. Verify server is in `mcpServers` array
2. Check server is enabled in `.kiro/settings/mcp.json`
3. Verify agent is in server's `allowedAgents`

---

## References

- [Kiro Custom Agents Documentation](https://docs.kiro.dev/agents)
- [Tool Reference](https://docs.kiro.dev/tools)
- [MCP Configuration](https://docs.kiro.dev/mcp)