"""
NetsaGuard AI: Shared Pydantic State Management
Defines typed models and graph state schemas for multi-agent execution.
"""

from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime


SupportedLanguage = Literal["amharic", "swahili", "afaan_oromo", "french", "hausa", "english"]


class LinguisticAnalysis(BaseModel):
    detected_language: SupportedLanguage = "amharic"
    script_type: str = "Ethiopic/Ge'ez"
    token_count: int = 0
    sentiment_polarity: float = 0.0
    cultural_context_tags: List[str] = Field(default_factory=list)
    slang_or_colloquialisms: List[str] = Field(default_factory=list)
    confidence_score: float = 0.95


class DisinformationThreatReport(BaseModel):
    threat_score: float = 0.0  # 0.0 (Clean) - 1.0 (Critical Threat)
    threat_level: Literal["SAFE", "LOW", "ELEVATED", "CRITICAL"] = "SAFE"
    flagged_keywords: List[str] = Field(default_factory=list)
    matched_blocklist_hashes: List[str] = Field(default_factory=list)
    botnet_astroturf_probability: float = 0.0
    forensic_notes: str = ""


class AntiCensorshipPayload(BaseModel):
    bypass_strategy: str = "homoglyphic_obfuscation"
    simulated_platform_risk: Dict[str, float] = Field(default_factory=lambda: {
        "twitter_x": 0.1,
        "facebook_meta": 0.15,
        "telegram": 0.05,
        "tiktok": 0.2
    })
    obfuscated_variants: List[str] = Field(default_factory=list)
    evasion_confidence: float = 0.92


class CreativeLayout(BaseModel):
    optimized_headlines: List[str] = Field(default_factory=list)
    suggested_hashtags: List[str] = Field(default_factory=list)
    call_to_action: str = ""
    engagement_reach_multiplier: float = 1.4


class CriticEvaluation(BaseModel):
    overall_score: float = 0.0  # 0 - 100
    linguistic_score: float = 0.0
    evasion_score: float = 0.0
    forensics_cleanliness: float = 0.0
    reach_score: float = 0.0
    passed_threshold: bool = False
    remediation_instructions: str = ""
    evaluation_timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class PIIRedactionResult(BaseModel):
    original_text: str = ""
    sanitized_text: str = ""
    redacted_entities: List[Dict[str, str]] = Field(default_factory=list)
    phone_numbers_redacted: int = 0
    names_redacted: int = 0
    locations_redacted: int = 0
    governance_compliant: bool = True


class ExecutionLogEntry(BaseModel):
    node_name: str
    status: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    details: Dict[str, Any] = Field(default_factory=dict)


class CryptographicManifest(BaseModel):
    campaign_id: str
    payload_sha256: str = ""
    hmac_signature: str = ""
    signer_identity: str = "NetsaGuard-African-Decentralized-Node-01"
    issued_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    ipfs_cid_mock: str = ""


class NetsaGuardState(BaseModel):
    """
    Central Pydantic state model passed and mutated across all LangGraph nodes.
    """
    thread_id: str = Field(..., description="Unique thread/session execution identifier")
    campaign_id: str = Field(default_factory=lambda: f"NG-{int(datetime.utcnow().timestamp())}")
    input_text: str = Field(..., description="Original raw text submitted by digital rights defender")
    target_language: SupportedLanguage = Field(default="amharic")
    
    # Worker Agent Output Payloads
    linguistic_analysis: Optional[LinguisticAnalysis] = None
    threat_report: Optional[DisinformationThreatReport] = None
    anticensorship_payload: Optional[AntiCensorshipPayload] = None
    creative_layout: Optional[CreativeLayout] = None
    
    # Critic & Self-Healing Guardrails
    critic_evaluation: Optional[CriticEvaluation] = None
    revision_count: int = Field(default=0, description="Number of self-healing revision loops executed")
    max_revision_attempts: int = Field(default=3, description="Maximum self-healing attempts before escalation")
    
    # Edge Governance & PII Redaction
    pii_sanitization: Optional[PIIRedactionResult] = None
    
    # Human-In-The-Loop (HITL) Status
    hitl_status: Literal["PENDING", "APPROVED", "REJECTED", "EDITED_BY_MODERATOR"] = "PENDING"
    hitl_reviewer_notes: Optional[str] = None
    hitl_approved_at: Optional[str] = None
    
    # Final Output & Cryptographic Manifest
    final_output_text: Optional[str] = None
    cryptographic_manifest: Optional[CryptographicManifest] = None
    
    # Execution Tracking & LangSmith Telemetry
    current_node: str = "supervisor"
    execution_logs: List[ExecutionLogEntry] = Field(default_factory=list)
    is_completed: bool = False
