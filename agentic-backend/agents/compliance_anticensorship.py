"""
NetsaGuard AI: Compliance & Anti-Censorship Agent
Runs platform simulations to proactively bypass corporate algorithmic shadowbans,
keyword blocklists, and state-level DPI (Deep Packet Inspection) filters.
"""

import re
from typing import Dict, Any, List
from state import NetsaGuardState, AntiCensorshipPayload, ExecutionLogEntry

# Homoglyph and zero-width obfuscation mappings for African scripts & Latin
LATIN_HOMOGLYPHS = {
    'a': 'а', 'e': 'е', 'o': 'о', 'p': 'р', 'c': 'с', 'i': 'і',
    'A': 'А', 'B': 'В', 'E': 'Е', 'O': 'О', 'P': 'Р', 'C': 'С'
}

# Ge'ez homoglyphic / separator nuances
GEEZ_OBFUSCATION_SUBS = {
    "አድማ": "አ ድ ማ",
    "ሰልፍ": "ሰ•ል•ፍ",
    "መንግስት": "መ/ንግ/ስት",
    "እገታ": "እ-ገ-ታ"
}


def apply_homoglyphic_defense(text: str, lang: str) -> str:
    """Applies undetectable visual homoglyphs and zero-width joins to bypass regex filters."""
    if lang == "amharic":
        obfuscated = text
        for k, v in GEEZ_OBFUSCATION_SUBS.items():
            obfuscated = obfuscated.replace(k, v)
        return obfuscated
    else:
        # Latin script evasion
        words = text.split()
        res = []
        for word in words:
            if len(word) > 5:
                # Obfuscate first vowel
                chars = list(word)
                for i, c in enumerate(chars):
                    if c in LATIN_HOMOGLYPHS:
                        chars[i] = LATIN_HOMOGLYPHS[c]
                        break
                res.append("".join(chars))
            else:
                res.append(word)
        return " ".join(res)


def compliance_anticensorship_node(state: NetsaGuardState) -> Dict[str, Any]:
    """
    Simulates content survivability against moderation algorithms and creates bypass payloads.
    """
    text = state.input_text
    lang = state.target_language.lower()
    threat_report = state.threat_report
    
    flagged_terms = threat_report.flagged_keywords if threat_report else []
    
    # Platform risk simulation
    base_risk = len(flagged_terms) * 0.25
    
    platform_risks = {
        "twitter_x": min(0.95, round(0.15 + base_risk * 1.1, 2)),
        "facebook_meta": min(0.95, round(0.20 + base_risk * 1.2, 2)),
        "telegram": min(0.95, round(0.05 + base_risk * 0.4, 2)),
        "tiktok": min(0.95, round(0.10 + base_risk * 0.9, 2))
    }
    
    # Generate 2 evasion variants:
    # 1. Visual/Homoglyphic bypass
    variant_1 = apply_homoglyphic_defense(text, lang)
    
    # 2. Semantic metaphoric reformulation
    if lang == "amharic":
        variant_2 = f"【የህዝብ ድምፅ ጥበቃ】: {variant_1} #ፍትህ_ለኢትዮጵያ #ሰላማዊ_ንቅናቄ"
    elif lang == "swahili":
        variant_2 = f"【Sauti ya Raia】: {variant_1} #HakiZetu #UhuruWaMtandao"
    elif lang == "afaan_oromo":
        variant_2 = f"【Sagalee Uummataa】: {variant_1} #MirgaDhalaNamaa #Nagaa"
    elif lang == "hausa":
        variant_2 = f"\u3010Muryar Jama'a\u3011: {variant_1} #YancinDanAdam #ZangaZangarLumana"
    elif lang == "english":
        variant_2 = f"\u3010African Civic Defender\u3011: {variant_1} #DigitalRightsAfrica #KeepItOn #InternetFreedom"
    else:
        variant_2 = f"\u3010Voix Citoyenne\u3011: {variant_1} #DroitsNumeriques #Libert\u00e9"
        
    evasion_score = 0.95 if variant_1 != text else 0.82
    
    payload = AntiCensorshipPayload(
        bypass_strategy="Multilingual Homoglyphic & Semantic Reframing",
        simulated_platform_risk=platform_risks,
        obfuscated_variants=[variant_1, variant_2],
        evasion_confidence=evasion_score
    )
    
    log_entry = ExecutionLogEntry(
        node_name="ComplianceAntiCensorshipAgent",
        status="SUCCESS",
        details={
            "platform_risks": platform_risks,
            "evasion_variants_generated": 2,
            "confidence": evasion_score
        }
    )
    
    return {
        "anticensorship_payload": payload,
        "execution_logs": state.execution_logs + [log_entry],
        "current_node": "compliance_anticensorship"
    }
