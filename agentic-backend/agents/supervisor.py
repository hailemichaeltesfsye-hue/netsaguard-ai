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
    
    # Assess context
    length_category = "LONG_FORM" if len(input_text.split()) > 100 else "SHORT_FORM_BROADCAST"
    
    log_entry = ExecutionLogEntry(
        node_name="SupervisorCoordinator",
        status="ORCHESTRATING",
        details={
            "campaign_id": state.campaign_id,
            "target_language": lang,
            "format": length_category,
            "current_revision_cycle": revision_count,
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
        "current_node": "supervisor"
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
