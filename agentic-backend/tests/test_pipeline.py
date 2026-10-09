"""
NetsaGuard AI: Comprehensive Multi-Agent Pipeline Test Suite
Validates state schemas, agent nodes, self-healing loop, PII scrubbing,
MCP tools, ChromaDB semantic retrieval, and HITL checkpoint resumption.
"""

try:
    import pytest
except ImportError:
    pytest = None
import uuid
from state import NetsaGuardState, SupportedLanguage
from graph import netsaguard_app_graph
from mcp_service.server import direct_fetch_threat_db, direct_generate_signed_report
from memory.vector_store import threat_vector_memory
from agents.pii_sanitizer import sanitize_african_pii


def test_mcp_threat_db_query():
    """Verify MCP tool fetches localized blocklists for African languages."""
    result = direct_fetch_threat_db(target_language="amharic", query_keywords=["አድማ", "ሰላማዊ"])
    assert result["status"] == "SUCCESS"
    assert result["language"] == "amharic"
    assert len(result["flagged_threats"]) >= 1
    assert result["flagged_threats"][0]["pattern"] == "አድማ"


def test_mcp_signed_compliance_manifest():
    """Verify HMAC-SHA256 cryptographic manifest signing."""
    report = direct_generate_signed_report(
        campaign_id="NG-TEST-001",
        sanitized_text="ሰላማዊ የዲጂታል መብት ጥሪ",
        pii_entities_count=0,
        passed_critic_score=92.5,
        target_language="amharic"
    )
    assert report["status"] == "SIGNED_SUCCESS"
    manifest = report["manifest"]
    assert manifest["campaign_id"] == "NG-TEST-001"
    assert manifest["payload_sha256"] != ""
    assert manifest["hmac_signature"].startswith("0x")
    assert manifest["signer_authority"] == "did:netsaguard:africa-node-east-01"


def test_chroma_vector_memory_retrieval():
    """Verify semantic similarity lookup in ChromaDB vector memory."""
    matches = threat_vector_memory.search_similar_threats(
        query_text="Finance bill youth protest suppression in Nairobi",
        n_results=1
    )
    assert len(matches) > 0
    match = matches[0]
    assert "document" in match
    assert match["similarity_score"] > 0.0


def test_pii_sanitizer_african_entities():
    """Verify regex scrubbing of African phone numbers and localized names."""
    raw_text = "Call activist Abebe Bikila at +251911234567 or Raila at +254712345678 at Meskel Square."
    sanitized, redacted, phones, names, locs = sanitize_african_pii(raw_text)
    
    assert "+251911234567" not in sanitized
    assert "+254712345678" not in sanitized
    assert "Abebe Bikila" not in sanitized
    assert "Meskel Square" not in sanitized
    assert phones == 2
    assert names >= 1
    assert locs >= 1


def test_langgraph_full_orchestration_and_hitl_resumption():
    """Verify end-to-end LangGraph execution, HITL interrupt, and resumption."""
    thread_id = f"test_thread_{uuid.uuid4().hex[:8]}"
    config = {"configurable": {"thread_id": thread_id}}
    
    # 1. Initial invocation (should pause at HITL checkpoint)
    initial_state = NetsaGuardState(
        thread_id=thread_id,
        input_text="የኢትዮጵያ ወጣቶች የዲጂታል መብት ጥሪ: +251911223344",
        target_language="amharic"
    )
    
    result = netsaguard_app_graph.invoke(initial_state.model_dump(), config=config)
    snapshot = netsaguard_app_graph.get_state(config)
    
    # Verify paused at HITL node
    assert snapshot.next == ("hitl_approval_node",)
    assert result["linguistic_analysis"] is not None
    assert result["threat_report"] is not None
    assert result["pii_sanitization"] is not None
    assert result["critic_evaluation"] is not None
    critic = result["critic_evaluation"]
    score = critic.overall_score if hasattr(critic, "overall_score") else critic["overall_score"]
    assert score >= 80.0
    
    # 2. Resume execution after moderator sign-off
    current_values = snapshot.values
    if isinstance(current_values, dict):
        current_values["hitl_status"] = "APPROVED"
        current_values["hitl_reviewer_notes"] = "Approved by automated test runner"
    else:
        current_values.hitl_status = "APPROVED"
        current_values.hitl_reviewer_notes = "Approved by automated test runner"
        
    netsaguard_app_graph.update_state(config, current_values)
    
    final_result = netsaguard_app_graph.invoke(None, config=config)
    final_snapshot = netsaguard_app_graph.get_state(config)
    
    # Verify completed
    assert len(final_snapshot.next) == 0
    is_comp = final_result.get("is_completed") if isinstance(final_result, dict) else final_result.is_completed
    assert is_comp is True
    
    manifest = final_result.get("cryptographic_manifest") if isinstance(final_result, dict) else final_result.cryptographic_manifest
    assert manifest is not None
    sig = manifest.hmac_signature if hasattr(manifest, "hmac_signature") else manifest.get("hmac_signature")
    assert sig != ""


if __name__ == "__main__":
    print("[NetsaGuard Tests] Running in-process validation...")
    test_mcp_threat_db_query()
    print("✓ test_mcp_threat_db_query PASSED")
    test_mcp_signed_compliance_manifest()
    print("✓ test_mcp_signed_compliance_manifest PASSED")
    test_chroma_vector_memory_retrieval()
    print("✓ test_chroma_vector_memory_retrieval PASSED")
    test_pii_sanitizer_african_entities()
    print("✓ test_pii_sanitizer_african_entities PASSED")
    test_langgraph_full_orchestration_and_hitl_resumption()
    print("✓ test_langgraph_full_orchestration_and_hitl_resumption PASSED")
    print("All 5 test suites passed successfully!")
