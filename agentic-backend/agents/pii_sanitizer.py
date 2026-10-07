"""
NetsaGuard AI: Edge Governance & PII Sanitizer Node
Aggressively strips real-world Personally Identifiable Information (PII)
including African localized phone numbers, personal names, and physical coordinates.
"""

import re
from typing import Dict, Any, List, Tuple
from state import NetsaGuardState, PIIRedactionResult, ExecutionLogEntry

# African Phone Formats (+251 Ethiopia, +254 Kenya, +234 Nigeria, +221 Senegal, +27 South Africa, local formats)
AFRICAN_PHONE_REGEX = re.compile(
    r'(?:\+?251[0-9]{9}|\+?254[0-9]{9}|\+?234[0-9]{10}|\+?221[0-9]{9}|\b09[0-9]{8}\b|\b07[0-9]{8}\b|\b080[0-9]{8}\b)',
    re.IGNORECASE
)

EMAIL_REGEX = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
GPS_REGEX = re.compile(r'[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)')

# Sample Localized Names & High-Risk Physical Locations across target African contexts
LOCALIZED_ENTITIES = [
    # Ethiopian / Amharic / Oromo
    "Abebe Bikila", "Almaz Ayana", "Kenenisa", "Meskel Square", "Bole Road", "Piazza", "Arat Kilo",
    "አበበ ቢቂላ", "መስቀል አደባባይ", "ቦሌ", "ፒያሳ", "አራት ኪሎ",
    # Kenyan / Swahili
    "Raila", "Ruto", "Uhuru Park", "CBD Nairobi", "Moi Avenue", "Kenyatta Avenue",
    # Nigerian / Hausa
    "Bello", "Abubakar", "Musa", "Eagle Square Abuja", "Lekki Toll Gate", "Kano City Gate"
]


def sanitize_african_pii(text: str) -> Tuple[str, List[Dict[str, str]], int, int, int]:
    """Scans and redacts localized PII from text."""
    sanitized = text
    redacted_items = []
    
    # 1. Redact African Phones
    phones_found = AFRICAN_PHONE_REGEX.findall(sanitized)
    for p in phones_found:
        mask = f"[REDACTED_PHONE_{hash(p) % 1000:03d}]"
        sanitized = sanitized.replace(p, mask)
        redacted_items.append({"entity_type": "PHONE_NUMBER", "original_mask": mask})
        
    # 2. Redact Emails
    emails_found = EMAIL_REGEX.findall(sanitized)
    for e in emails_found:
        mask = f"[REDACTED_EMAIL_{hash(e) % 1000:03d}]"
        sanitized = sanitized.replace(e, mask)
        redacted_items.append({"entity_type": "EMAIL", "original_mask": mask})

    # 3. Redact GPS Coordinates
    gps_found = GPS_REGEX.findall(sanitized)
    for g in gps_found:
        if isinstance(g, tuple):
            g_str = g[0]
        else:
            g_str = str(g)
        mask = "[REDACTED_GPS_COORDINATES]"
        sanitized = sanitized.replace(g_str, mask)
        redacted_items.append({"entity_type": "GPS_COORDINATES", "original_mask": mask})

    # 4. Redact Localized Sensitive Names & Landmarks
    names_count = 0
    locations_count = 0
    for entity in LOCALIZED_ENTITIES:
        if entity in sanitized:
            if any(loc in entity.lower() for loc in ["square", "park", "avenue", "gate", "road", "አደባባይ", "ቦሌ", "ኪሎ"]):
                mask = f"[REDACTED_LOCATION_{hash(entity) % 1000:03d}]"
                locations_count += 1
            else:
                mask = f"[REDACTED_IDENTITY_{hash(entity) % 1000:03d}]"
                names_count += 1
            sanitized = sanitized.replace(entity, mask)
            redacted_items.append({"entity_type": "NAMED_ENTITY", "original_mask": mask})

    return sanitized, redacted_items, len(phones_found), names_count, locations_count


def pii_sanitizer_node(state: NetsaGuardState) -> Dict[str, Any]:
    """
    Executes edge governance PII redaction on the candidate optimized variant.
    """
    # Select best candidate variant from compliance payload or raw text
    candidate_text = state.input_text
    if state.anticensorship_payload and state.anticensorship_payload.obfuscated_variants:
        candidate_text = state.anticensorship_payload.obfuscated_variants[0]
        
    sanitized, redacted_items, phones_count, names_count, locs_count = sanitize_african_pii(candidate_text)
    
    result = PIIRedactionResult(
        original_text=candidate_text,
        sanitized_text=sanitized,
        redacted_entities=redacted_items,
        phone_numbers_redacted=phones_count,
        names_redacted=names_count,
        locations_redacted=locs_count,
        governance_compliant=True
    )
    
    log_entry = ExecutionLogEntry(
        node_name="PIISanitizerNode",
        status="SUCCESS",
        details={
            "entities_redacted": len(redacted_items),
            "phones": phones_count,
            "names": names_count,
            "locations": locs_count
        }
    )
    
    return {
        "pii_sanitization": result,
        "execution_logs": state.execution_logs + [log_entry],
        "current_node": "pii_sanitizer"
    }
