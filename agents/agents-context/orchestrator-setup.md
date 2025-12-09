# Orchestrator Agent Setup

## Overview
The orchestrator agent is the main backend service that coordinates multiple AI agents using Google ADK (Agent Development Kit) and FastAPI.

## Setup Completed

### Environment
- **Package Manager**: uv
- **Python Version**: >=3.11
- **Virtual Environment**: `.venv` (created by uv)

### Dependencies Installed
Key dependencies from `pyproject.toml`:
- `google-cloud-aiplatform[adk,agent-engines]>=1.108.0` - Google AI Platform with ADK
- `google-adk>=1.10.0` - Agent Development Kit
- `fastapi>=0.109.0` - Web framework
- `uvicorn>=0.27.0` - ASGI server
- `llama-index>=0.12` - LLM framework
- `python-dotenv>=1.0.0` - Environment configuration

Total packages installed: 165

### Configuration Fix
Fixed `pyproject.toml` to include package specification for hatchling:
```toml
[tool.hatch.build.targets.wheel]
packages = ["orchestrator-agent"]
```

This was required because the package directory name (`orchestrator-agent`) doesn't follow Python naming conventions (uses hyphens).

## Running the Orchestrator

### Command
```bash
cd agents/orchestrator
uv run python main.py [--host HOST] [--port PORT]
```

### Default Settings
- Host: `0.0.0.0`
- Port: `8000`
- Web UI: Enabled
- CORS: Allows all origins

### Server Features
- FastAPI application with Google ADK integration
- Async event loop (Windows and Unix compatible)
- Uvicorn ASGI server
- Access logging enabled

## File Structure
```
agents/orchestrator/
├── main.py                    # Server entry point
├── pyproject.toml             # Dependencies and build config
├── orchestrator-agent/        # Agent package
│   ├── __init__.py
│   └── agent.py              # Agent implementation
├── .venv/                     # Virtual environment (uv managed)
└── uv.lock                    # Dependency lock file
```

## Next Steps
- Configure Google Cloud credentials
- Implement agent logic in `orchestrator-agent/agent.py`
- Set up environment variables (.env file)
- Test agent endpoints

