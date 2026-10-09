import React, { useState } from 'react';
import { 
  Cpu, Globe, Search, ShieldCheck, Sparkles, Scale, Lock, PauseCircle, Award, 
  RotateCw, CheckCircle2, ArrowRight, Zap 
} from 'lucide-react';

export default function NetworkGraph({ 
  currentNode, 
  revisionCount = 0, 
  isCompleted = false, 
  hitlPaused = false,
  nodeLatencies = {}
}) {
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = [
    { 
      id: 'supervisor', 
      label: 'Supervisor Coordinator', 
      icon: Cpu, 
      x: 50, 
      y: 14, 
      role: 'Master Orchestration & Routing Hub',
      color: '#00FFA3',
      desc: 'Evaluates context, dispatches to parallel/sequential workers, tracks cross-continental tokens.'
    },
    { 
      id: 'linguistic_specialist', 
      label: 'Linguistic Specialist', 
      icon: Globe, 
      x: 18, 
      y: 40, 
      role: '6-Language Tokenizer & Sentiment',
      color: '#00E5FF',
      desc: 'Detects Ethiopic Ge\'ez Unicode, Qubee phonetics, Boko/Ajami orthography, and native civic sentiment.'
    },
    { 
      id: 'disinformation_forensics', 
      label: 'Disinfo Forensics', 
      icon: Search, 
      x: 39, 
      y: 40, 
      role: 'MCP Blocklists & Botnet Audit',
      color: '#FFB800',
      desc: 'Scans MCP decentralized blocklists and indexes ChromaDB vectors against state astroturfing botnets.'
    },
    { 
      id: 'compliance_anticensorship', 
      label: 'Anti-Censorship Engine', 
      icon: ShieldCheck, 
      x: 61, 
      y: 40, 
      role: 'Homoglyphic & Evasion Synthesis',
      color: '#C084FC',
      desc: 'Simulates platform moderation algorithms (X, Meta, Telegram, TikTok) & crafts homoglyphic bypass variants.'
    },
    { 
      id: 'creative_optimization', 
      label: 'Creative Reach Optimizer', 
      icon: Sparkles, 
      x: 82, 
      y: 40, 
      role: 'Civic Hashtags & 1.65x Reach Multiplier',
      color: '#FB923C',
      desc: 'Generates viral headlines, African civic hashtags (#DigitalRightsAfrica), and localized civic CTAs.'
    },
    { 
      id: 'critic_judge', 
      label: 'Critic & Judge Node', 
      icon: Scale, 
      x: 50, 
      y: 65, 
      role: 'Quality Gate & Self-Healing Guardrail',
      color: '#FF3366',
      desc: 'Scores 4 defense dimensions out of 100. Enforces 80% threshold; loops back if rejected (max 3 cycles).'
    },
    { 
      id: 'pii_sanitizer', 
      label: 'Edge Governance PII Scrubber', 
      icon: Lock, 
      x: 50, 
      y: 82, 
      role: 'African Phone & Entity Redactor',
      color: '#10B981',
      desc: 'Strips +251, +254, +234 phones, Ge\'ez/Latin names, GPS coordinates, and sensitive activist locations.'
    },
    { 
      id: 'hitl_approval_checkpoint', 
      label: 'HITL Moderator Checkpoint', 
      icon: PauseCircle, 
      x: 24, 
      y: 93, 
      role: 'Human-in-the-Loop interrupt_before',
      color: '#F59E0B',
      desc: 'Deterministic checkpoint pausing execution until physical digital rights moderator sign-off.'
    },
    { 
      id: 'finalizer_manifest', 
      label: 'MCP Cryptographic Finalizer', 
      icon: Award, 
      x: 76, 
      y: 93, 
      role: 'HMAC-SHA256 & IPFS Manifest',
      color: '#00FFA3',
      desc: 'Generates immutable HMAC-SHA256 signature and IPFS CID certifying zero PII leakage.'
    }
  ];

  const isNodeActive = (nodeId) => {
    if (isCompleted) return nodeId === 'finalizer_manifest';
    if (hitlPaused) return nodeId === 'hitl_approval_checkpoint' || nodeId === 'pii_sanitizer';
    return currentNode === nodeId || (currentNode === 'supervisor' && nodeId === 'supervisor');
  };

  const isSelfHealingActive = revisionCount > 0 && !isCompleted;

  return (
    <div className="cyber-card" style={{ padding: '22px', marginBottom: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px', 
            background: 'rgba(0, 255, 163, 0.15)', 
            border: '1px solid var(--cyber-emerald)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Zap style={{ color: 'var(--cyber-emerald)', width: '18px', height: '18px' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              LangGraph Multi-Agent Execution Radar
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Real-time Pydantic State traversal across Supervisor & Worker nodes
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {revisionCount > 0 && (
            <span className="badge badge-amber" style={{ animation: 'urgent-neon-pulse 2s infinite' }}>
              <RotateCw style={{ width: '12px', height: '12px' }} />
              Self-Healing Loop: Cycle {revisionCount}/3 Active
            </span>
          )}
          <span className={`badge ${isCompleted ? 'badge-emerald' : hitlPaused ? 'badge-amber' : 'badge-cyan'}`}>
            {isCompleted ? 'PIPELINE SIGNED' : hitlPaused ? 'PAUSED AT HITL CHECKPOINT' : 'DYNAMIC ORCHESTRATION'}
          </span>
        </div>
      </div>

      {/* SVG Canvas DAG Canvas */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '350px', 
        background: 'rgba(5, 8, 14, 0.75)', 
        borderRadius: 'var(--radius-sm)', 
        overflow: 'hidden', 
        border: '1px solid rgba(255, 255, 255, 0.05)' 
      }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="gradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFA3" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="gradAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFB800" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF3366" stopOpacity="0.6" />
            </linearGradient>
            <filter id="nodeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Supervisor to Workers */}
          <line x1="50%" y1="18%" x2="18%" y2="40%" stroke="rgba(0, 255, 163, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50%" y1="18%" x2="39%" y2="40%" stroke="rgba(0, 255, 163, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50%" y1="18%" x2="61%" y2="40%" stroke="rgba(0, 255, 163, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="50%" y1="18%" x2="82%" y2="40%" stroke="rgba(0, 255, 163, 0.3)" strokeWidth="2" strokeDasharray="4 4" />

          {/* Workers to Critic */}
          <line x1="18%" y1="45%" x2="50%" y2="65%" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="2" />
          <line x1="39%" y1="45%" x2="50%" y2="65%" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="2" />
          <line x1="61%" y1="45%" x2="50%" y2="65%" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="2" />
          <line x1="82%" y1="45%" x2="50%" y2="65%" stroke="rgba(0, 229, 255, 0.3)" strokeWidth="2" />

          {/* Self-Healing Loop: Critic Back to Supervisor */}
          <path 
            d="M 50% 65% C 6% 65%, 6% 18%, 50% 18%" 
            fill="none" 
            stroke={isSelfHealingActive ? "#FFB800" : "rgba(255, 184, 0, 0.2)"} 
            strokeWidth={isSelfHealingActive ? "3" : "1.5"} 
            strokeDasharray="6 4"
            style={{
              filter: isSelfHealingActive ? 'drop-shadow(0 0 8px rgba(255, 184, 0, 0.8))' : 'none'
            }}
          />

          {/* Critic to PII Sanitizer */}
          <line x1="50%" y1="68%" x2="50%" y2="82%" stroke="rgba(0, 255, 163, 0.45)" strokeWidth="2.5" />

          {/* PII Sanitizer to HITL & Manifest */}
          <line x1="50%" y1="84%" x2="24%" y2="93%" stroke="rgba(255, 184, 0, 0.5)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="24%" y1="93%" x2="76%" y2="93%" stroke="rgba(0, 255, 163, 0.6)" strokeWidth="2" />

          {/* Animated Particle Stream */}
          <circle cx="50%" cy="18%" r="4" fill="#00FFA3" filter="url(#nodeGlow)">
            <animate attributeName="cy" values="18%;40%;65%;82%;93%" dur="3.5s" repeatCount="indefinite" />
          </circle>

          {isSelfHealingActive && (
            <circle cx="50%" cy="65%" r="4.5" fill="#FFB800" filter="url(#nodeGlow)">
              <animate attributeName="cx" values="50%;10%;50%" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="cy" values="65%;40%;18%" dur="2.2s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((n) => {
          const active = isNodeActive(n.id);
          const Icon = n.icon;
          const isSelected = selectedNode?.id === n.id;

          return (
            <div
              key={n.id}
              onClick={() => setSelectedNode(n)}
              style={{
                position: 'absolute',
                left: `${n.x}%`,
                top: `${n.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Node Icon Avatar */}
              <div
                style={{
                  width: active ? '44px' : '36px',
                  height: active ? '44px' : '36px',
                  borderRadius: '50%',
                  background: active 
                    ? `linear-gradient(135deg, ${n.color} 0%, #05080E 100%)` 
                    : 'rgba(14, 21, 35, 0.9)',
                  border: `2px solid ${active ? n.color : isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.12)'}`,
                  boxShadow: active ? `0 0 25px ${n.color}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <Icon style={{ 
                  color: active ? '#05080E' : n.color, 
                  width: active ? '20px' : '16px', 
                  height: active ? '20px' : '16px' 
                }} />
              </div>

              {/* Node Label Card */}
              <div
                style={{
                  marginTop: '6px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: active ? 'rgba(0, 0, 0, 0.85)' : 'rgba(5, 8, 14, 0.7)',
                  border: `1px solid ${active ? n.color : 'rgba(255, 255, 255, 0.06)'}`,
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: active ? '#FFFFFF' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap'
                }}
              >
                {n.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Node Inspector Detail Drawer */}
      {selectedNode && (
        <div style={{
          marginTop: '14px',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255, 255, 255, 0.02)',
          border: `1px solid ${selectedNode.color}40`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: selectedNode.color }}>
                {selectedNode.label}
              </span>
              <span className="badge" style={{ background: `${selectedNode.color}22`, color: selectedNode.color, fontSize: '0.65rem' }}>
                {selectedNode.role}
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {selectedNode.desc}
            </p>
          </div>
          <button 
            onClick={() => setSelectedNode(null)}
            className="cyber-button cyber-button-outline"
            style={{ padding: '4px 10px', fontSize: '0.72rem' }}
          >
            Close Inspector
          </button>
        </div>
      )}
    </div>
  );
}
