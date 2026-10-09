"""
NetsaGuard AI: Model Context Protocol (MCP) Server
Exposes standardized local MCP tools for decentralized threat verification
and tamper-proof cryptographic compliance manifest generation.
Compatible with MCP v1 and MCP v2 architectures.
"""

from mcp_service.server import (
    mcp_server,
    SECRET_KEY,
    DECENTRALIZED_BLOCKLIST,
    fetch_decentralized_threat_db,
    generate_signed_compliance_report,
    direct_fetch_threat_db,
    direct_generate_signed_report
)

__all__ = [
    "mcp_server",
    "SECRET_KEY",
    "DECENTRALIZED_BLOCKLIST",
    "fetch_decentralized_threat_db",
    "generate_signed_compliance_report",
    "direct_fetch_threat_db",
    "direct_generate_signed_report"
]

if __name__ == "__main__":
    print("[NetsaGuard MCP Server] Starting Model Context Protocol Server on stdio...")
    mcp_server.run()
