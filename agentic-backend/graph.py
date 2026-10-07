"""
NetsaGuard AI: Master LangGraph Multi-Agent Orchestration Graph
Assembles the complete state machine with self-healing critic loop,
PII edge governance, HITL interrupt checkpoint, and MCP cryptographic finalizer.
"""

from typing import Dict, Any
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

from state import NetsaGuardState, CryptographicManifest, ExecutionLogEntry
from agents.supervisor import supervisor_node, should_continue_or_sanitize
from agents.linguistic_specialist import linguistic_specialist_node
from agents.disinformation_forensics import disinformation_forensics_node
from agents.compliance_anticensorship import compliance_anticensorship_node
from agents.creative_optimization import creative_optimization_node
from agents.critic_judge import critic_judge_node
from agents.pii_sanitizer import pii_sanitizer_node
from mcp.server import direct_generate_signed_report


def hitl_approval_node(state: NetsaGuardState) -> Dict[str, Any]:
    """
    Human-in-the-Loop (HITL) Checkpoint Node.
    Execution state is inspected or resumed after human moderator review.
    """
    status = state.hitl_status
    log_entry = ExecutionLogEntry(
        node_name="HITLApprovalCheckpoint",
        status=f"MODERATOR_{status}",
        details={
            "status": status,
            "reviewer_notes": state.hitl_reviewer_notes or "Awaiting UI sign-off"
        }
    )
    return {
        "execution_logs": state.execution_logs + [log_entry],
        "current_node": "hitl_approval_checkpoint"
    }


def finalizer_manifest_node(state: NetsaGuardState) -> Dict[str, Any]:
    """
    Final node generating the tamper-proof cryptographic manifest via MCP tool.
    """
    sanitized_text = state.pii_sanitization.sanitized_text if state.pii_sanitization else state.input_text
    pii_count = len(state.pii_sanitization.redacted_entities) if state.pii_sanitization else 0
    score = state.critic_evaluation.overall_score if state.critic_evaluation else 90.0
    
    # Call MCP signed compliance report tool
    mcp_report = direct_generate_signed_report(
        campaign_id=state.campaign_id,
        sanitized_text=sanitized_text,
        pii_entities_count=pii_count,
        passed_critic_score=score,
        target_language=state.target_language
    )
    
    manifest_data = mcp_report.get("manifest", {})
    
    manifest = CryptographicManifest(
        campaign_id=state.campaign_id,
        payload_sha256=manifest_data.get("payload_sha256", ""),
        hmac_signature=manifest_data.get("hmac_signature", ""),
        signer_identity=manifest_data.get("signer_authority", "did:netsaguard:africa-node-east-01"),
        issued_at=manifest_data.get("issued_at", ""),
        ipfs_cid_mock=manifest_data.get("ipfs_cid", "")
    )
    
    log_entry = ExecutionLogEntry(
        node_name="CryptographicManifestGenerator",
        status="COMPLETED",
        details={
            "sha256": manifest.payload_sha256,
            "hmac_signature": manifest.hmac_signature,
            "ipfs_cid": manifest.ipfs_cid_mock
        }
    )
    
    return {
        "final_output_text": sanitized_text,
        "cryptographic_manifest": manifest,
        "is_completed": True,
        "execution_logs": state.execution_logs + [log_entry],
        "current_node": "finalizer_manifest"
    }


def build_netsaguard_graph():
    """
    Compiles the full NetsaGuard AI StateGraph.
    """
    builder = StateGraph(NetsaGuardState)
    
    # Register all Graph Nodes
    builder.add_node("supervisor", supervisor_node)
    builder.add_node("linguistic_specialist", linguistic_specialist_node)
    builder.add_node("disinformation_forensics", disinformation_forensics_node)
    builder.add_node("compliance_anticensorship", compliance_anticensorship_node)
    builder.add_node("creative_optimization", creative_optimization_node)
    builder.add_node("critic_judge", critic_judge_node)
    builder.add_node("pii_sanitizer", pii_sanitizer_node)
    builder.add_node("hitl_approval_node", hitl_approval_node)
    builder.add_node("finalizer_manifest", finalizer_manifest_node)
    
    # Define Graph Edges & Flow
    builder.add_edge(START, "supervisor")
    
    # Sequential / Parallel orchestration from Supervisor across 4 workers
    builder.add_edge("supervisor", "linguistic_specialist")
    builder.add_edge("linguistic_specialist", "disinformation_forensics")
    builder.add_edge("disinformation_forensics", "compliance_anticensorship")
    builder.add_edge("compliance_anticensorship", "creative_optimization")
    builder.add_edge("creative_optimization", "critic_judge")
    
    # Conditional Self-Healing Loop Edge from Critic Node
    builder.add_conditional_edges(
        "critic_judge",
        should_continue_or_sanitize,
        {
            "supervisor": "supervisor",      # Self-Healing Loop (<80% score)
            "pii_sanitizer": "pii_sanitizer" # Passed (>=80% score or max revisions)
        }
    )
    
    # Edge Governance to HITL Checkpoint
    builder.add_edge("pii_sanitizer", "hitl_approval_node")
    
    # From HITL to Finalizer
    builder.add_edge("hitl_approval_node", "finalizer_manifest")
    builder.add_edge("finalizer_manifest", END)
    
    # Checkpointer for persistent state & HITL resumption
    checkpointer = MemorySaver()
    
    # Compile graph with HITL interrupt before hitl_approval_node
    compiled_graph = builder.compile(
        checkpointer=checkpointer,
        interrupt_before=["hitl_approval_node"]
    )
    
    return compiled_graph


# Precompiled singleton graph
netsaguard_app_graph = build_netsaguard_graph()
