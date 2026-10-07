# NetsaGuard AI — Agentic Backend Core

Decentralized, Privacy-Preserving Multi-Agent Anti-Censorship Network powered by **LangGraph**, **ChromaDB**, and **FastMCP**.

## Architecture Overview
- **Supervisor**: Coordinates 4 worker agents (`LinguisticSpecialist`, `DisinformationForensics`, `ComplianceAntiCensorship`, `CreativeOptimization`).
- **Critic / Judge Node**: Evaluates against an 80% threshold and orchestrates the self-healing revision loop (`max_revision_attempts = 3`).
- **Edge Governance PII Sanitizer**: Strips African localized phone numbers, names, and GPS coordinates.
- **Human-in-the-Loop (HITL)**: LangGraph `interrupt_before=["hitl_approval_node"]` with persistent memory checkpoints.
- **Model Context Protocol (FastMCP)**: Decentralized threat blocklists and HMAC-SHA256 cryptographic manifest signing.

## Quickstart (Powered by `uv`)
```powershell
# 1. Create and activate virtual environment
uv venv

# 2. Install dependencies
uv pip install -e .

# 3. Configure environment
cp .env.example .env

# 4. Launch FastAPI server
uv run uvicorn app:app --reload --port 8000
```

## Running Automated Tests
```powershell
uv run python tests/test_pipeline.py
```
