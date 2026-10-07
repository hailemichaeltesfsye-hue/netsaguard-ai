"""
NetsaGuard AI: FastAPI Gateway & LangSmith Observability Server
Exposes REST and WebSocket endpoints for LangGraph multi-agent orchestration,
state inspection, HITL human checkpoint resumption, and decentralized MCP tools.
"""

import os
import uuid
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load Environment Variables & LangSmith Tracing
load_dotenv()

from state import NetsaGuardState, SupportedLanguage
from graph import netsaguard_app_graph
from mcp.server import direct_fetch_threat_db

app = FastAPI(
    title="NetsaGuard AI Agentic Core API",
    description="Africa-First Digital Rights Multi-Agent Orchestration & Anti-Censorship Hub",
    version="1.0.0"
)

# Enable CORS for React PWA and Express Gateway
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CampaignSubmitRequest(BaseModel):
    input_text: str
    target_language: SupportedLanguage = "amharic"
    thread_id: Optional[str] = None


class CampaignResumeRequest(BaseModel):
    thread_id: str
    action: str = "APPROVE"  # "APPROVE", "REJECT", "EDIT"
    reviewer_notes: Optional[str] = "Approved by digital rights moderator via NetsaGuard PWA."
    edited_text: Optional[str] = None


@app.get("/health")
def health_check():
    return {
        "status": "ONLINE",
        "service": "NetsaGuard AI Agentic Orchestrator",
        "langsmith_tracing": os.getenv("LANGCHAIN_TRACING_V2", "false") == "true",
        "supported_languages": ["amharic", "swahili", "afaan_oromo", "french", "hausa", "english"],
        "graph_nodes": [
            "supervisor", "linguistic_specialist", "disinformation_forensics",
            "compliance_anticensorship", "creative_optimization",
            "critic_judge", "pii_sanitizer", "hitl_approval_node", "finalizer_manifest"
        ]
    }


@app.post("/api/campaign/submit")
async def submit_campaign(req: CampaignSubmitRequest):
    """
    Submits a campaign to the LangGraph Multi-Agent Orchestrator.
    Executes through Supervisor -> Workers -> Critic Loop -> PII Sanitizer -> HITL Interrupt.
    """
    thread_id = req.thread_id or f"thread_{uuid.uuid4().hex[:12]}"
    config = {"configurable": {"thread_id": thread_id}}
    
    initial_state = NetsaGuardState(
        thread_id=thread_id,
        input_text=req.input_text,
        target_language=req.target_language
    )
    
    try:
        # Run graph until interrupt_before=["hitl_approval_node"]
        result = netsaguard_app_graph.invoke(initial_state.model_dump(), config=config)
        
        # Check current state from checkpointer
        state_snapshot = netsaguard_app_graph.get_state(config)
        
        is_paused_at_hitl = bool(state_snapshot.next and "hitl_approval_node" in state_snapshot.next)
        
        return {
            "status": "WAITING_FOR_HUMAN_APPROVAL" if is_paused_at_hitl else "COMPLETED",
            "thread_id": thread_id,
            "state": result,
            "next_step": list(state_snapshot.next) if state_snapshot.next else []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Orchestration failure: {str(e)}")


@app.post("/api/campaign/resume")
async def resume_campaign(req: CampaignResumeRequest):
    """
    Resumes LangGraph execution after Human-in-the-Loop approval/rejection.
    Finalizes cryptographic HMAC manifest and delivers output.
    """
    config = {"configurable": {"thread_id": req.thread_id}}
    
    try:
        # Retrieve state at checkpoint
        current_snapshot = netsaguard_app_graph.get_state(config)
        if not current_snapshot.values:
            raise HTTPException(status_code=404, detail="Thread session not found in checkpointer.")
            
        current_data = current_snapshot.values
        
        # Update HITL fields
        status_map = {
            "APPROVE": "APPROVED",
            "REJECT": "REJECTED",
            "EDIT": "EDITED_BY_MODERATOR"
        }
        current_data["hitl_status"] = status_map.get(req.action.upper(), "APPROVED")
        current_data["hitl_reviewer_notes"] = req.reviewer_notes
        
        if req.edited_text and current_data.get("pii_sanitization"):
            current_data["pii_sanitization"]["sanitized_text"] = req.edited_text
            
        # Update state in graph checkpointer and resume
        netsaguard_app_graph.update_state(config, current_data)
        
        # Resume execution through hitl_approval_node -> finalizer_manifest -> END
        resumed_result = netsaguard_app_graph.invoke(None, config=config)
        
        return {
            "status": "FINALIZED_AND_CERTIFIED",
            "thread_id": req.thread_id,
            "state": resumed_result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resumption error: {str(e)}")


@app.get("/api/campaign/state/{thread_id}")
async def get_campaign_state(thread_id: str):
    """Retrieves current execution state for a given thread."""
    config = {"configurable": {"thread_id": thread_id}}
    snapshot = netsaguard_app_graph.get_state(config)
    if not snapshot.values:
        raise HTTPException(status_code=404, detail="Thread not found.")
        
    return {
        "thread_id": thread_id,
        "values": snapshot.values,
        "next": list(snapshot.next) if snapshot.next else []
    }


@app.get("/api/threat-db")
async def get_threat_db(language: str = "amharic"):
    """MCP endpoint for decentralised threat blocklists."""
    return direct_fetch_threat_db(target_language=language)


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"[NetsaGuard Agentic Core] Starting server on http://localhost:{port}")
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
