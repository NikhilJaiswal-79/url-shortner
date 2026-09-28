# MCP Configuration

**Lesson 6: Model Context Protocol (MCP)**

MCP is a protocol that extends Kiro's capabilities by connecting to external servers that provide specialized tools, prompts, and resources.

---

## What is MCP?

MCP (Model Context Protocol) enables Kiro to:
- Access external APIs and services
- Use specialized tools from third-party servers
- Fetch live documentation and resources
- Integrate with cloud services and databases

---

## MCP Configuration Structure

MCP servers are configured in `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "uvx",              // Executable (uvx, npx, python, etc.)
      "args": ["package@latest"],     // Arguments for the command
      "disabled": false,              // Enable/disable server
      "env": {},                      // Environment variables
      "description": "What it does",  // Human-readable description
      "allowedAgents": ["name"]       // Which agents can use it
    }
  }
}
```

---

## MCP Servers in This Project

### 1. url-validator

| Property | Value |
|----------|-------|
| **Command** | `uvx` |
| **Package** | `mcp-server-validate@latest` |
| **Purpose** | Validates URLs and checks for broken links |
| **Allowed Agents** | code-reviewer, default |

**Usage in Kiro:**
```
Can you validate these URLs using the url-validator MCP tool?
- https://example.com/page1
- https://example.com/page2
```

**Tools Provided:**
- `validate_url(url)` → Validates URL format
- `check_link(url)` → Checks if URL is accessible
- `batch_validate(urls)` → Validates multiple URLs

---

### 2. aws-docs

| Property | Value |
|----------|-------|
| **Command** | `uvx` |
| **Package** | `awslabs.aws-documentation-mcp-server@latest` |
| **Purpose** | Fetch AWS documentation for deployment |
| **Allowed Agents** | default |

**Usage in Kiro:**
```
How do I deploy this Node.js API to AWS Lambda? Check the aws-docs for guidance.
```

**Tools Provided:**
- `search_docs(query)` → Search AWS documentation
- `get_service_info(service)` → Get service details
- `get_best_practices(topic)` → Best practices for a topic

---

### 3. rest-api-tools

| Property | Value |
|----------|-------|
| **Command** | `npx` |
| **Package** | `@modelcontextprotocol/server-rest@latest` |
| **Purpose** | REST API testing and documentation tools |
| **Allowed Agents** | default, code-reviewer |

**Usage in Kiro:**
```
Use the rest-api-tools to test my URL Shortener endpoints.
Make a POST request to create a short URL.
```

**Tools Provided:**
- `make_request(method, url, body)` → Make HTTP requests
- `test_endpoint(method, url, expected)` → Test API endpoints
- `generate_openapi(spec)` → Generate OpenAPI spec

---

## How MCP Works

### 1. Server Connection
When Kiro starts, it:
1. Reads `.kiro/settings/mcp.json`
2. Connects to configured MCP servers
3. Exposes server tools to the agent

### 2. Tool Invocation
When you ask for something requiring an MCP tool:
1. Kiro identifies which MCP server has the tool
2. Sends the request to the MCP server
3. Receives the response
4. Incorporates it into the answer

### 3. Agent Restrictions
The `allowedAgents` field controls access:
```json
"allowedAgents": ["code-reviewer", "default"]
```
Only listed agents can use this server's tools.

---

## Installation Requirements

MCP servers using `uvx` require:
- **uv** - Python package manager (https://docs.astral.sh/uv/)
- **Python** - For uvx to work

### Installation Commands

```bash
# Install uv (Windows)
pip install uv

# Or using winget
winget install astral-sh.uv

# Or using chocolatey
choco install uv

# Or using npm (alternative)
npm install -g uvx
```

Once installed, MCP servers can be installed without extra commands:
```bash
# uvx downloads and runs the package automatically
uvx mcp-server-validate
```

---

## Troubleshooting MCP

### Server Won't Connect
1. Check if `uv` is installed: `uv --version`
2. Verify mcp.json syntax is valid
3. Check the server isn't disabled (`"disabled": false`)

### Tool Not Available
1. Verify `allowedAgents` includes your agent
2. Check if the server has loaded (look for startup logs)
3. Try restarting Kiro to reconnect servers

### Environment Variables
Some servers need environment variables:
```json
"env": {
  "API_KEY": "your-key-here",
  "LOG_LEVEL": "INFO"
}
```

---

## Common MCP Servers

| Server | Description |
|--------|-------------|
| `awslabs.aws-documentation-mcp-server` | AWS documentation |
| `mcp-server-validate` | URL validation |
| `@modelcontextprotocol/server-rest` | REST API tools |
| `github.com/mcp/servers/github` | GitHub API access |
| `anthropic-ai/mcp-servers/puppeteer` | Browser automation |

---

## Creating Custom MCP Servers

Custom MCP servers can be built in any language:

```python
# server.py
from mcp.server import Server
from mcp.types import Tool

app = Server("my-custom-server")

@app.list_tools()
async def list_tools():
    return [
        Tool(
            name="my-tool",
            description="What my tool does",
            inputSchema={"type": "object", "properties": {"param": {"type": "string"}}}
        )
    ]

@app.call_tool()
async def call_tool(name, arguments):
    if name == "my-tool":
        return {"result": f"Processed: {arguments['param']}"}
    raise ValueError(f"Unknown tool: {name}")
```

Run with:
```bash
python server.py
```

---

## Best Practices

1. **Pin versions**: Use `@latest` or specific versions like `@1.2.3`
2. **Set timeouts**: Long-running servers may need timeout configuration
3. **Limit agents**: Only allow necessary agents to access sensitive servers
4. **Secure credentials**: Use environment variables for API keys
5. **Document tools**: Comment what each server's tools do

---

## Example Workflow

```
User: "Validate all the URLs in my database and tell me which ones are broken."

Kiro:
[Uses url-validator MCP server]
[Checks each URL in the database]
[Returns a report of broken links]

User: "How do I deploy this to AWS?"

Kiro:
[Uses aws-docs MCP server]
[Fetches deployment guide for Node.js on AWS]
[Provides step-by-step instructions]
```