"""
NetsaGuard AI: Supervisor Coordinator Node
Centralized routing and dispatch hub in LangGraph. Analyzes input context,
monitors execution stages, and coordinates worker agents.
"""

from typing import Dict, Any, List
from state import NetsaGuardState, ExecutionLogEntry


def supervisor_node(state: NetsaGuardState) -> Dict[str, Any]:
    """
    Supervisor node coordinates tasks across workers.
    Evaluates campaign payload characteristics and logs orchestration status.
    """
    input_text = state.input_text
    lang = state.target_language.lower()
    revision_count = state.revision_count
    
    import time
    start_time = time.time()
    
    # Assess context
    length_category = "LONG_FORM" if len(input_text.split()) > 100 else "SHORT_FORM_BROADCAST"
    token_count = len(input_text.split())
    
    # Generate deterministic LangSmith & Arize trace IDs if not present
    trace_id = state.langsmith_trace_id or f"ls_trace_{state.thread_id}_{revision_count}"
    arize_id = state.arize_trace_id or f"arize_span_{state.thread_id}_{revision_count}"
    
    # Cross-continental script metadata
    script_map = {
        "amharic": "Ethiopic/Ge'ez (Unicode 1200-137F)",
        "swahili": "Latin-Swahili Standard (East African Bantu)",
        "afaan_oromo": "Qubee Phonetics (Cushitic Orthography)",
        "french": "Francophone African (Sahel/West Africa)",
        "hausa": "Boko/Ajami (Chadic Orthography)",
        "english": "Pan-African Diaspora Standard"
    }
    
    cross_tokens = {
        "language": lang,
        "script": script_map.get(lang, "Latin/Standard"),
        "raw_token_count": token_count,
        "is_cross_continental": True,
        "routing_policy": "PARALLEL_DEFENSE_SPECIALISTS"
    }
    
    latency_ms = round((time.time() - start_time) * 1000, 2)
    latencies = {**state.node_latencies, "supervisor": latency_ms}
    
    log_entry = ExecutionLogEntry(
        node_name="SupervisorCoordinator",
        status="ORCHESTRATING",
        details={
            "campaign_id": state.campaign_id,
            "target_language": lang,
            "format": length_category,
            "current_revision_cycle": revision_count,
            "langsmith_trace_id": trace_id,
            "arize_trace_id": arize_id,
            "dispatched_workers": [
                "LinguisticSpecialistAgent",
                "DisinformationForensicsAgent",
                "ComplianceAntiCensorshipAgent",
                "CreativeOptimizationAgent"
            ]
        }
    )
    
    return {
        "execution_logs": state.execution_logs + [log_entry],
        "current_node": "supervisor",
        "langsmith_trace_id": trace_id,
        "arize_trace_id": arize_id,
        "cross_continental_tokens": cross_tokens,
        "total_tokens_processed": state.total_tokens_processed + token_count,
        "node_latencies": latencies
    }


def should_continue_or_sanitize(state: NetsaGuardState) -> str:
    """
    Conditional routing edge from Critic Node:
    - If Critic score >= 80% or reached max_revision_attempts (3), proceed to PII Sanitizer.
    - If Critic score < 80% and revision_count < 3, loop back to supervisor/workers (Self-Healing Loop).
    """
    critic = state.critic_evaluation
    
    if not critic:
        return "pii_sanitizer"
        
    if critic.passed_threshold or state.revision_count >= state.max_revision_attempts:
        return "pii_sanitizer"
    else:
        # Loop back to self-healing worker stage
        return "supervisor"
