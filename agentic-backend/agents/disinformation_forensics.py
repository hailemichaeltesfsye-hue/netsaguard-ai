"""
NetsaGuard AI: Disinformation Forensics Agent
Audits inputs against decentralized threat blocklists and ChromaDB memory to flag
coordinated botnets, state-sponsored astroturfing, and hazardous disinformation signatures.
"""

from typing import Dict, Any, List
from state import NetsaGuardState, DisinformationThreatReport, ExecutionLogEntry
from mcp.server import direct_fetch_threat_db
from memory.vector_store import threat_vector_memory


def disinformation_forensics_node(state: NetsaGuardState) -> Dict[str, Any]:
    """
    Scans input tokens against MCP decentralized threat databases and historical ChromaDB vectors.
    """
    text = state.input_text
    lang = state.target_language.lower()
    
    # 1. Query MCP Decentralized Blocklist
    tokens = text.split()
    mcp_result = direct_fetch_threat_db(target_language=lang, query_keywords=tokens)
    flagged_threats = mcp_result.get("flagged_threats", [])
    
    # 2. Query Long-term ChromaDB Vector Memory
    vector_matches = threat_vector_memory.search_similar_threats(query_text=text, n_results=2)
    
    flagged_keywords = [t["pattern"] for t in flagged_threats]
    matched_hashes = [t["hash"] for t in flagged_threats]
    
    # Calculate baseline threat score
    severity_sum = sum(t.get("severity", 0.5) for t in flagged_threats)
    base_score = min(1.0, severity_sum)
    
    # Factor in Vector Memory similarity
    vector_risk_bonus = 0.0
    forensic_notes_list = []
    
    if vector_matches:
        for match in vector_matches:
            sim = match.get("similarity_score", 0.0)
            if sim > 0.6:
                vector_risk_bonus += 0.2
                meta = match.get("metadata", {})
                forensic_notes_list.append(
                    f"Match with historical {meta.get('country', 'African')} tactic ({meta.get('tactic', 'THREAT')} - {meta.get('year', 2024)})"
                )
    
    total_threat_score = min(1.0, base_score + vector_risk_bonus)
    
    if total_threat_score >= 0.7:
        level = "CRITICAL"
    elif total_threat_score >= 0.4:
        level = "ELEVATED"
    elif total_threat_score > 0.1:
        level = "LOW"
    else:
        level = "SAFE"
        
    botnet_prob = round(min(0.95, total_threat_score * 0.85), 2)
    
    notes = " | ".join(forensic_notes_list) if forensic_notes_list else "No known state astroturfing match found in ChromaDB memory."
    
    report = DisinformationThreatReport(
        threat_score=round(total_threat_score, 2),
        threat_level=level,
        flagged_keywords=flagged_keywords,
        matched_blocklist_hashes=matched_hashes,
        botnet_astroturf_probability=botnet_prob,
        forensic_notes=notes
    )
    
    log_entry = ExecutionLogEntry(
        node_name="DisinformationForensicsAgent",
        status="SUCCESS",
        details={
            "threat_level": level,
            "threat_score": total_threat_score,
            "flagged_keywords_count": len(flagged_keywords),
            "mcp_matches": len(flagged_threats),
            "chroma_matches": len(vector_matches)
        }
    )
    
    return {
        "threat_report": report,
        "execution_logs": state.execution_logs + [log_entry],
        "current_node": "disinformation_forensics"
    }
