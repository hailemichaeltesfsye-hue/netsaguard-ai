"""
NetsaGuard AI: Creative Optimization Agent
Refines syntax layouts, headlines, and call-to-action structures
to maximize secure digital reach and community engagement.
Supports 6 languages: Amharic, Swahili, Afaan Oromo, French, Hausa, English.
"""

from typing import Dict, Any, List
from state import NetsaGuardState, CreativeLayout, ExecutionLogEntry


LANGUAGE_HASHTAGS = {
    "amharic": ["#\u12e8\u12f2\u1302\u1273\u120d_\u1218\u1265\u1275", "#\u12f5\u121d\u1353\u127b\u1295_\u12ed\u1230\u121b", "#\u12a2\u1275\u12ee\u1335\u12eb_\u12ed\u12f5\u1228\u1235", "#\u1230\u120b\u121b\u12ca_\u1295\u124d\u1293\u1240"],
    "swahili": ["#HakiZaKidijitali", "#SautiYetu", "#UhuruWaKujieleza", "#PamojaTwaweza"],
    "afaan_oromo": ["#MirgaSagalee", "#OromiaDigital", "#NagaaFiGudddina", "#Tokkummaa"],
    "french": ["#DroitsHumains", "#Libert\u00e9Expression", "#AfriqueNumerique", "#Transparence"],
    "hausa": ["#YancinDanAdam", "#MuryarArewa", "#KareHakkinJamaa", "#ZamanLafiya"],
    "english": ["#DigitalRightsAfrica", "#KeepItOn", "#InternetFreedom", "#AfricaRising", "#NetsaGuard"],
}

LANGUAGE_CTAS = {
    "amharic": "\u12ed\u1205\u1295\u1295 \u1218\u120d\u12d3\u12ad\u1275 \u1208\u1273\u1218\u1291 \u121b\u1205\u1260\u1228\u1230\u1266\u127d \u12a5\u1293 \u12e8\u1230\u1265\u12a0\u12ca \u1218\u1265\u1275 \u1270\u1237\u17d4\u130a\u127d \u12eb\u130b\u1229\u1362",
    "swahili": "Sambaza ujumbe huu salama kwa watetezi wa haki na jamii yako.",
    "afaan_oromo": "Ergaa kana jaallattoota nagaa fi mirgaatiif qoodaa.",
    "french": "Diffusez ce message s\u00e9curis\u00e9 aux d\u00e9fenseurs des droits et \u00e0 votre communaut\u00e9.",
    "hausa": "Raba wannan sa\u0199o mai aminci ga masu fafutukar kare ha\u0199\u0199in \u0257an adam.",
    "english": "Share this secure broadcast with digital rights defenders and your trusted community networks.",
}


def creative_optimization_node(state: NetsaGuardState) -> Dict[str, Any]:
    """
    Synthesizes creative delivery formats and optimized campaign structures.
    """
    lang = state.target_language.lower()
    text = state.input_text

    suggested_hashtags = LANGUAGE_HASHTAGS.get(lang, LANGUAGE_HASHTAGS["amharic"])
    cta = LANGUAGE_CTAS.get(lang, LANGUAGE_CTAS["amharic"])

    # Generate high-impact headline variants per language
    if lang == "amharic":
        headlines = [
            f"\ud83d\udce2 \u12a0\u1235\u1348\u120b\u130a\u12ed \u12e8\u1230\u1265\u12a0\u12ca \u1218\u1265\u1275 \u121b\u1233\u1233\u1228\u1262\u12eb: {text[:40]}...",
            f"\u270a \u12e8\u12dc\u130a\u127d \u12e8\u130b\u122b \u12f5\u121d\u1355: {text[:40]}..."
        ]
    elif lang == "swahili":
        headlines = [
            f"\ud83d\udce2 Ilani ya Haki za Raia: {text[:40]}...",
            f"\u270a Msimamo wa Umma: {text[:40]}..."
        ]
    elif lang == "afaan_oromo":
        headlines = [
            f"\ud83d\udce2 Beeksisa Mirga Uummataa: {text[:40]}...",
            f"\u270a Sagalee Tokkummaa: {text[:40]}..."
        ]
    elif lang == "hausa":
        headlines = [
            f"\ud83d\udce2 Sanarwar Kare Hakki: {text[:40]}...",
            f"\u270a Muryar Hadin Kai: {text[:40]}..."
        ]
    elif lang == "english":
        headlines = [
            f"\ud83d\udce2 African Digital Rights Alert: {text[:40]}...",
            f"\u270a Civic Defender Broadcast: {text[:40]}..."
        ]
    else:
        # French default
        headlines = [
            f"\ud83d\udce2 Alerte Droits Num\u00e9riques: {text[:40]}...",
            f"\u270a Voix Citoyenne Unie: {text[:40]}..."
        ]

    layout = CreativeLayout(
        optimized_headlines=headlines,
        suggested_hashtags=suggested_hashtags,
        call_to_action=cta,
        engagement_reach_multiplier=1.65
    )

    log_entry = ExecutionLogEntry(
        node_name="CreativeOptimizationAgent",
        status="SUCCESS",
        details={
            "headlines_count": len(headlines),
            "hashtags_count": len(suggested_hashtags),
            "reach_multiplier": 1.65
        }
    )

    return {
        "creative_layout": layout,
        "execution_logs": state.execution_logs + [log_entry],
        "current_node": "creative_optimization"
    }
