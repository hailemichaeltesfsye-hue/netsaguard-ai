import React from 'react';
import { Cpu, Globe, Search, ShieldCheck, Sparkles, Scale, Lock, PauseCircle, Award } from 'lucide-react';

export default function NetworkGraph({ currentNode, revisionCount, isCompleted, hitlPaused }) {
  const nodes = [
    { id: 'supervisor', label: 'Supervisor Coordinator', icon: Cpu, x: 50, y: 15, role: 'Central Orchestration' },
    { id: 'linguistic_specialist', label: 'Linguistic Specialist', icon: Globe, x: 18, y: 40, role: '5-Lang Semantic Tokenizer' },
    { id: 'disinformation_forensics', label: 'Disinfo Forensics', icon: Search, x: 38, y: 40, role: 'Blocklists & Botnet Forensics' },
    { id: 'compliance_anticensorship', label: 'Anti-Censorship Agent', icon: ShieldCheck, x: 62, y: 40, role: 'Evasion & Bypass Synthesizer' },
    { id: 'creative_optimization', label: 'Creative Optimizer', icon: Sparkles, x: 82, y: 40, role: 'Outreach & Syntax Refiner' },
    { id: 'critic_judge', label: 'Critic & Judge Node', icon: Scale, x: 50, y: 65, role: 'Self-Healing 80% Threshold' },
    { id: 'pii_sanitizer', label: 'PII Edge Governance', icon: Lock, x: 50, y: 82, role: 'African Phone & Entity Scrubber' },
    { id: 'hitl_approval_checkpoint', label: 'HITL Checkpoint', icon: PauseCircle, x: 22, y: 92, role: 'Moderator Human-in-the-Loop' },
    { id: 'finalizer_manifest', label: 'MCP Signed Manifest', icon: Award, x: 78, y: 92, role: 'HMAC-SHA256 Cryptography' }
  ];

  const isNodeActive = (nodeId) => {
    if (isCompleted) return nodeId === 'finalizer_manifest';
    if (hitlPaused) return nodeId === 'hitl_approval_checkpoint' || nodeId === 'pii_sanitizer';
    return currentNode === nodeId || (currentNode === 'supervisor' && nodeId === 'supervisor');
  };

  return (
    <div className="cyber-card" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu style={{ color: 'var(--cyber-emerald)', width: '18px', height: '18px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>LangGraph Multi-Agent Execution Radar</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {revisionCount > 0 && (
            <span className="badge badge-amber">
              Self-Healing Loop: Cycle {revisionCount}/3
            </span>
          )}
          <span className={`badge ${isCompleted ? 'badge-emerald' : hitlPaused ? 'badge-amber' : 'badge-cyan'}`}>
            {isCompleted ? 'COMPLETED & SIGNED' : hitlPaused ? 'HITL CHECKPOINT PAUSED' : 'DYNAMIC ORCHESTRATION'}
          </span>
        </div>
      </div>

      {/* SVG Canvas for DAG Connections and Animated Packets */}
      <div style={{ position: 'relative', width: '100%', height: '320px', background: 'rgba(5, 8, 14, 0.6)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="gradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFA3" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="gradAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB800" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF3366" stopOpacity="0.5" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Supervisor to Workers */}
          <line x1="50%" y1="20%" x2="18%" y2="40%" stroke="rgba(0, 255, 163, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50%" y1="20%" x2="38%" y2="40%" stroke="rgba(0, 255, 163, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50%" y1="20%" x2="62%" y2="40%" stroke="rgba(0, 255, 163, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50%" y1="20%" x2="82%" y2="40%" stroke="rgba(0, 255, 163, 0.25)" strokeWidth="2" strokeDasharray="4 4" />

          {/* Workers to Critic */}
          <line x1="18%" y1="45%" x2="50%" y2="65%" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="2" />
          <line x1="38%" y1="45%" x2="50%" y2="65%" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="2" />
          <line x1="62%" y1="45%" x2="50%" y2="65%" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="2" />
          <line x1="82%" y1="45%" x2="50%" y2="65%" stroke="rgba(0, 229, 255, 0.25)" strokeWidth="2" />

          {/* Critic Loop Back to Supervisor (Self-Healing) */}
          <path d="M 50% 65% C 10% 65%, 10% 20%, 50% 20%" fill="none" stroke="rgba(255, 184, 0, 0.4)" strokeWidth="2" strokeDasharray="6 4" />

          {/* Critic to PII Sanitizer */}
          <line x1="50%" y1="68%" x2="50%" y2="82%" stroke="rgba(0, 255, 163, 0.4)" strokeWidth="2" />

          {/* PII Sanitizer to HITL & Manifest */}
          <line x1="50%" y1="84%" x2="22%" y2="92%" stroke="rgba(255, 184, 0, 0.5)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="22%" y1="92%" x2="78%" y2="92%" stroke="rgba(0, 255, 163, 0.5)" strokeWidth="2" />

          {/* Animated Particle Packet */}
          <circle cx="50%" cy="20%" r="4" fill="#00FFA3" filter="url(#glow)">
            <animate attributeName="cy" values="20%;40%;65%;82%;92%" dur="4s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Interactive Node Badges */}
        {nodes.map((n) => {
          const active = isNodeActive(n.id);
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              style={{
                position: 'absolute',
                left: `${n.x}%`,
                top: `${n.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: active ? 'linear-gradient(135deg, #00FFA3 0%, #00B371 100%)' : '#0D1420',
                  border: `1.5px solid ${active ? '#00FFA3' : 'rgba(255, 255, 255, 0.15)'}`,
                  boxShadow: active ? '0 0 20px var(--cyber-emerald-glow)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <Icon style={{ width: '18px', height: '18px', color: active ? '#070A0E' : 'var(--text-secondary)' }} />
              </div>
              <span style={{ 
                fontSize: '0.68rem', 
                fontWeight: active ? 700 : 500, 
                marginTop: '4px', 
                color: active ? 'var(--cyber-emerald)' : 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                textShadow: active ? '0 0 10px rgba(0, 255, 163, 0.5)' : 'none'
              }}>
                {n.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
