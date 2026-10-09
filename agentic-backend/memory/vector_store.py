"""
NetsaGuard AI: Strategic Long-Term Vector Memory (ChromaDB)
Stores & retrieves semantic embeddings of documented anti-rights tactics,
censorship maneuvers, and state-sponsored astroturfing across African digital ecosystems.
"""

import os
import hashlib
from typing import List, Dict, Any
import chromadb
from chromadb.config import Settings


class AfricanThreatVectorStore:
    def __init__(self, persist_directory: str = "./data/chroma_db"):
        os.makedirs(persist_directory, exist_ok=True)
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.client.get_or_create_collection(
            name="african_digital_threats",
            metadata={"description": "Historical African digital rights violations, censorship keywords, and botnet vectors"}
        )
        self._seed_historical_threats_if_empty()

    def _seed_historical_threats_if_empty(self):
        """Pre-seeds the vector store with verified historical African censorship and disinformation tactics."""
        count = self.collection.count()
        if count == 0:
            seed_data = [
                {
                    "id": "ETH-2020-SHUTDOWN",
                    "document": "State-directed throttling of telecom DNS and Telegram blacklists during regional tensions in Ethiopia (Amharic keywords targeted: ሰልፍ, ድምፃችን, እገታ).",
                    "metadata": {
                        "country": "Ethiopia",
                        "region": "East Africa",
                        "language": "amharic",
                        "tactic": "DNS_BLOCK_AND_KEYWORD_CENSORSHIP",
                        "risk_level": "CRITICAL",
                        "year": 2020
                    }
                },
                {
                    "id": "KEN-2024-PROTEST-THROTTLE",
                    "document": "Coordinated hashtag shadowbanning and botnet astroturfing on Twitter/X to suppress citizen mobilization (#RejectFinanceBill, Swahili keywords: maandamano, sauti yetu).",
                    "metadata": {
                        "country": "Kenya",
                        "region": "East Africa",
                        "language": "swahili",
                        "tactic": "HASHTAG_SUPPRESSION_ASTROTURFING",
                        "risk_level": "HIGH",
                        "year": 2024
                    }
                },
                {
                    "id": "NGA-2020-ENDSARS-FILTER",
                    "document": "Automated banking restriction flag matches and keyword algorithmic downranking against digital activists in Nigeria (Hausa/Yoruba/Pidgin activism phrases).",
                    "metadata": {
                        "country": "Nigeria",
                        "region": "West Africa",
                        "language": "hausa",
                        "tactic": "FINANCIAL_SHADOWBAN_BOTNET",
                        "risk_level": "CRITICAL",
                        "year": 2020
                    }
                },
                {
                    "id": "ETH-OROMO-2022-DISINFO",
                    "document": "Coordinated disinformation campaigns targeting Afaan Oromo rights campaigns using localized bot farms and ethnic polarization narratives.",
                    "metadata": {
                        "country": "Ethiopia",
                        "region": "East Africa",
                        "language": "afaan_oromo",
                        "tactic": "ETHNIC_ASTROTURFING_DISINFORMATION",
                        "risk_level": "HIGH",
                        "year": 2022
                    }
                },
                {
                    "id": "SAHEL-2023-DISINFO-CAMPAIGN",
                    "document": "Foreign-sponsored bot network deploying French and Hausa language disinformation memes to undermine civic election monitors in Niger and Mali.",
                    "metadata": {
                        "country": "Mali/Niger",
                        "region": "Sahel/West Africa",
                        "language": "french",
                        "tactic": "FOREIGN_INFORMATION_WARFARE",
                        "risk_level": "ELEVATED",
                        "year": 2023
                    }
                }
            ]

            ids = [item["id"] for item in seed_data]
            documents = [item["document"] for item in seed_data]
            metadatas = [item["metadata"] for item in seed_data]

            self.collection.add(
                ids=ids,
                documents=documents,
                metadatas=metadatas
            )
            print(f"[NetsaGuard ChromaDB] Pre-seeded {len(ids)} African digital threat historical records.")

    def search_similar_threats(self, query_text: str, n_results: int = 3) -> List[Dict[str, Any]]:
        """Queries the vector memory to detect matching historical censorship tactics."""
        try:
            results = self.collection.query(
                query_texts=[query_text],
                n_results=n_results
            )
            
            matched_threats = []
            if results and results.get("documents") and len(results["documents"]) > 0:
                for idx in range(len(results["documents"][0])):
                    doc = results["documents"][0][idx]
                    meta = results["metadatas"][0][idx] if results.get("metadatas") else {}
                    distance = results["distances"][0][idx] if results.get("distances") else 0.0
                    # Robust normalized similarity score in range (0.0, 1.0]
                    sim = round(1.0 / (1.0 + max(0.0, distance)), 3)
                    matched_threats.append({
                        "document": doc,
                        "metadata": meta,
                        "similarity_score": max(0.05, sim)
                    })
            return matched_threats
        except Exception as e:
            print(f"[NetsaGuard ChromaDB] Query error: {e}")
            return []

    def store_new_threat_pattern(self, pattern_text: str, metadata: Dict[str, Any]) -> str:
        """Dynamically indexes newly discovered censorship attacks for perpetual learning."""
        threat_id = f"THREAT-{hashlib.sha256(pattern_text.encode()).hexdigest()[:10].upper()}"
        self.collection.add(
            ids=[threat_id],
            documents=[pattern_text],
            metadatas=[metadata]
        )
        return threat_id


# Singleton instance
threat_vector_memory = AfricanThreatVectorStore()
