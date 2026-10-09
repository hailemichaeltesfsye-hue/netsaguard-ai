import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Cpu, Globe, Search, ShieldCheck, Sparkles, Scale, Lock,
  PauseCircle, Award, RotateCw, Zap
} from 'lucide-react';

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function lerp(a, b, t) { return a + (b - a) * t; }

// Maps node ID to x/y positions in percentage (0-100) of the SVG viewport
const NODE_POSITIONS = {
  supervisor:                { x: 50,  y: 13 },
  linguistic_specialist:     { x: 16,  y: 39 },
  disinformation_forensics:  { x: 37,  y: 39 },
  compliance_anticensorship: { x: 63,  y: 39 },
  creative_optimization:     { x: 84,  y: 39 },
  critic_judge:              { x: 50,  y: 64 },
  pii_sanitizer:             { x: 50,  y: 80 },
  hitl_approval_checkpoint:  { x: 24,  y: 93 },
  finalizer_manifest:        { x: 76,  y: 93 },
};

// Edge definitions: which nodes are connected
const EDGES = [
  // Supervisor â†’ Workers
  { id: 'sv-ling',  from: 'supervisor', to: 'linguistic_specialist',     color: '#00FFA3', dashed: true },
  { id: 'sv-dis',   from: 'supervisor', to: 'disinformation_forensics',  color: '#00FFA3', dashed: true },
  { id: 'sv-comp',  from: 'supervisor', to: 'compliance_anticensorship', color: '#00FFA3', dashed: true },
  { id: 'sv-cre',   from: 'supervisor', to: 'creative_optimization',     color: '#00FFA3', dashed: true },
  // Workers â†’ Critic
  { id: 'ling-cr',  from: 'linguistic_specialist',     to: 'critic_judge', color: '#00E5FF', dashed: false },
  { id: 'dis-cr',   from: 'disinformation_forensics',  to: 'critic_judge', color: '#FFB800', dashed: false },
  { id: 'comp-cr',  from: 'compliance_anticensorship', to: 'critic_judge', color: '#C084FC', dashed: false },
  { id: 'cre-cr',   from: 'creative_optimization',     to: 'critic_judge', color: '#FB923C', dashed: false },
  // Critic â†’ PII
  { id: 'cr-pii',   from: 'critic_judge', to: 'pii_sanitizer',          color: '#00FFA3', dashed: false },
  // PII â†’ HITL + Manifest
  { id: 'pii-hitl', from: 'pii_sanitizer', to: 'hitl_approval_checkpoint', color: '#F59E0B', dashed: true },
  { id: 'pii-man',  from: 'pii_sanitizer', to: 'finalizer_manifest',    color: '#00FFA3', dashed: false },
  // HITL â†’ Manifest
  { id: 'hitl-man', from: 'hitl_approval_checkpoint', to: 'finalizer_manifest', color: '#F59E0B', dashed: false },
];

// Self-healing loop: Critic â†’ Supervisor (curved arc)
const SELF_HEAL_EDGE = {
  id: 'sh-loop',
  from: 'critic_judge',
  to:   'supervisor',
  color: '#FFB800',
};

// Which edges fire packets for a given active agent
const AGENT_EDGE_MAP = {
  supervisor:                ['sv-ling', 'sv-dis', 'sv-comp', 'sv-cre'],
  linguistic_specialist:     ['ling-cr'],
  disinformation_forensics:  ['dis-cr'],
  compliance_anticensorship: ['comp-cr'],
  creative_optimization:     ['cre-cr'],
  critic_judge:              ['cr-pii'],
  pii_sanitizer:             ['pii-hitl', 'pii-man'],
  hitl_approval_checkpoint:  ['hitl-man'],
  finalizer_manifest:        [],
  idle:                      [],
};

const NODE_META = [
  { id: 'supervisor',                icon: Cpu,        label: 'Supervisor Coordinator',        color: '#00FFA3', role: 'Master Orchestration & Routing Hub',          desc: 'Evaluates context, dispatches to parallel/sequential workers, tracks cross-continental tokens.' },
  { id: 'linguistic_specialist',     icon: Globe,      label: 'Linguistic Specialist',          color: '#00E5FF', role: '6-Language Tokenizer & Sentiment',             desc: "Detects Ethiopic Ge'ez Unicode, Qubee phonetics, Boko/Ajami orthography, and native civic sentiment." },
  { id: 'disinformation_forensics',  icon: Search,     label: 'Disinfo Forensics',              color: '#FFB800', role: 'MCP Blocklists & Botnet Audit',                desc: 'Scans MCP decentralized blocklists and indexes ChromaDB vectors against state astroturfing botnets.' },
  { id: 'compliance_anticensorship', icon: ShieldCheck,label: 'Anti-Censorship Engine',         color: '#C084FC', role: 'Homoglyphic & Evasion Synthesis',              desc: 'Simulates platform moderation algorithms (X, Meta, Telegram, TikTok) & crafts homoglyphic bypass variants.' },
  { id: 'creative_optimization',     icon: Sparkles,   label: 'Creative Reach Optimizer',       color: '#FB923C', role: 'Civic Hashtags & 1.65x Reach Multiplier',     desc: 'Generates viral headlines, African civic hashtags (#DigitalRightsAfrica), and localized civic CTAs.' },
  { id: 'critic_judge',              icon: Scale,      label: 'Critic & Judge Node',            color: '#FF3366', role: 'Quality Gate & Self-Healing Guardrail',        desc: 'Scores 4 defense dimensions out of 100. Enforces 80% threshold; loops back if rejected (max 3 cycles).' },
  { id: 'pii_sanitizer',             icon: Lock,       label: 'Edge Governance PII Scrubber',   color: '#10B981', role: 'African Phone & Entity Redactor',              desc: "Strips +251, +254, +234 phones, Ge'ez/Latin names, GPS coordinates, and sensitive activist locations." },
  { id: 'hitl_approval_checkpoint',  icon: PauseCircle,label: 'HITL Moderator Checkpoint',      color: '#F59E0B', role: 'Human-in-the-Loop interrupt_before',           desc: 'Deterministic checkpoint pausing execution until physical digital rights moderator sign-off.' },
  { id: 'finalizer_manifest',        icon: Award,      label: 'MCP Cryptographic Finalizer',    color: '#00FFA3', role: 'HMAC-SHA256 & IPFS Manifest',                  desc: 'Generates immutable HMAC-SHA256 signature and IPFS CID certifying zero PII leakage.' },
];

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function NetworkGraph({
  currentNode,
  revisionCount = 0,
  isCompleted = false,
  hitlPaused = false,
  nodeLatencies = {}
}) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [particles, setParticles] = useState([]); // [{id, edgeId, t, color, isSelfHeal}]
  const animRef = useRef(null);
  const particleIdRef = useRef(0);

  const isNodeActive = (nodeId) => {
    if (isCompleted) return nodeId === 'finalizer_manifest';
    if (hitlPaused) return nodeId === 'hitl_approval_checkpoint' || nodeId === 'pii_sanitizer';
    return currentNode === nodeId;
  };

  const isSelfHealingActive = revisionCount > 0 && !isCompleted;

  // â”€â”€ Particle animation loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const SPEED = 0.008; // fraction of edge per frame (â‰ˆ60fps â†’ ~2s crossing)
  const SPAWN_RATE = 60; // frames between automatic spawns per active edge
  const frameRef = useRef(0);

  useEffect(() => {
    const activeEdgeIds = AGENT_EDGE_MAP[currentNode] || [];

    const animate = () => {
      frameRef.current++;

      setParticles(prev => {
        let next = prev
          .map(p => ({ ...p, t: p.t + SPEED }))
          .filter(p => p.t < 1.02);

        // Spawn new packets on active edges
        if (frameRef.current % SPAWN_RATE === 0) {
          activeEdgeIds.forEach(eid => {
            const edge = EDGES.find(e => e.id === eid);
            if (!edge) return;
            next = [...next, {
              id: particleIdRef.current++,
              edgeId: eid,
              t: 0,
              color: edge.color,
              isSelfHeal: false,
            }];
          });

          // Self-healing loop
          if (isSelfHealingActive && frameRef.current % (SPAWN_RATE * 2) === 0) {
            next = [...next, {
              id: particleIdRef.current++,
              edgeId: 'sh-loop',
              t: 0,
              color: '#FFB800',
              isSelfHeal: true,
            }];
          }
        }

        return next;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [currentNode, isSelfHealingActive]);

  // â”€â”€ Compute particle (cx, cy) from edge t â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const getParticlePos = useCallback((edgeId, t, svgW, svgH) => {
    if (edgeId === 'sh-loop') {
      // Bezier arc: critic â†’ supervisor curving left
      const from = NODE_POSITIONS['critic_judge'];
      const to   = NODE_POSITIONS['supervisor'];
      const cpX = 4, cpY = (from.y + to.y) / 2;
      const bx = (1 - t) * (1 - t) * (from.x / 100 * svgW) + 2 * (1 - t) * t * (cpX / 100 * svgW) + t * t * (to.x / 100 * svgW);
      const by = (1 - t) * (1 - t) * (from.y / 100 * svgH) + 2 * (1 - t) * t * (cpY / 100 * svgH) + t * t * (to.y / 100 * svgH);
      return { x: bx, y: by };
    }
    const edge = EDGES.find(e => e.id === edgeId);
    if (!edge) return { x: 0, y: 0 };
    const from = NODE_POSITIONS[edge.from];
    const to   = NODE_POSITIONS[edge.to];
    return {
      x: lerp(from.x / 100 * svgW, to.x / 100 * svgW, t),
      y: lerp(from.y / 100 * svgH, to.y / 100 * svgH, t),
    };
  }, []);

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const SVG_W = 1000;
  const SVG_H = 380;

  const px = (v) => `${(v / 100) * SVG_W}`;
  const py = (v) => `${(v / 100) * SVG_H}`;

  return (
    <div className="cyber-card" style={{ padding: '22px', marginBottom: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,255,163,0.15)', border: '1px solid var(--cyber-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ color: 'var(--cyber-emerald)', width: '18px', height: '18px' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em' }}>LangGraph Multi-Agent Execution Radar</h3>
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

      {/* SVG Canvas */}
      <div style={{ position: 'relative', width: '100%', background: 'rgba(5,8,14,0.8)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ width: '100%', display: 'block' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="glow4" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow2" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Animated dash travel: used for edge lines */}
            <style>{`
              @keyframes dashFlow { to { stroke-dashoffset: -24; } }
              @keyframes nodeRing { 0%,100%{r:22;opacity:.7} 50%{r:30;opacity:0} }
              @keyframes nodePulse { 0%,100%{opacity:.9} 50%{opacity:.4} }
            `}</style>
          </defs>

          {/* â”€â”€ Static Edges â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {EDGES.map(edge => {
            const from = NODE_POSITIONS[edge.from];
            const to   = NODE_POSITIONS[edge.to];
            const active = AGENT_EDGE_MAP[currentNode]?.includes(edge.id);
            return (
              <line
                key={edge.id}
                x1={px(from.x)} y1={py(from.y)}
                x2={px(to.x)}   y2={py(to.y)}
                stroke={active ? edge.color : `${edge.color}40`}
                strokeWidth={active ? 2.2 : 1.4}
                strokeDasharray={edge.dashed ? '7 5' : (active ? '0' : '0')}
                style={active ? { animation: 'dashFlow 0.6s linear infinite', filter: `drop-shadow(0 0 6px ${edge.color})` } : {}}
              />
            );
          })}

          {/* â”€â”€ Self-Healing Arc â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <path
            d={`M ${px(NODE_POSITIONS.critic_judge.x)} ${py(NODE_POSITIONS.critic_judge.y)}
                Q ${px(4)} ${py((NODE_POSITIONS.critic_judge.y + NODE_POSITIONS.supervisor.y) / 2)}
                  ${px(NODE_POSITIONS.supervisor.x)} ${py(NODE_POSITIONS.supervisor.y)}`}
            fill="none"
            stroke={isSelfHealingActive ? '#FFB800' : 'rgba(255,184,0,0.18)'}
            strokeWidth={isSelfHealingActive ? 2.5 : 1.2}
            strokeDasharray="8 5"
            style={isSelfHealingActive ? { animation: 'dashFlow 0.8s linear infinite', filter: 'drop-shadow(0 0 8px #FFB800)' } : {}}
          />

          {/* â”€â”€ Data-Packet Particles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {particles.map(p => {
            const pos = getParticlePos(p.edgeId, p.t, SVG_W, SVG_H);
            const opacity = p.t < 0.1 ? p.t * 10 : p.t > 0.88 ? (1 - p.t) * 8 : 1;
            return (
              <g key={p.id} filter="url(#glow4)">
                {/* Outer glow ring */}
                <circle cx={pos.x} cy={pos.y} r="8" fill={p.color} opacity={opacity * 0.3} />
                {/* Core packet */}
                <circle cx={pos.x} cy={pos.y} r="4" fill={p.color} opacity={opacity} />
                {/* White center spark */}
                <circle cx={pos.x} cy={pos.y} r="1.8" fill="#FFFFFF" opacity={opacity * 0.9} />
              </g>
            );
          })}

          {/* â”€â”€ Agent Nodes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {NODE_META.map(node => {
            const pos = NODE_POSITIONS[node.id];
            const active = isNodeActive(node.id);
            const Icon = node.icon;
            const x = parseFloat(px(pos.x));
            const y = parseFloat(py(pos.y));

            return (
              <g
                key={node.id}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
              >
                {/* Active pulse ring */}
                {active && (
                  <circle
                    cx={x} cy={y} r="22"
                    fill="none"
                    stroke={node.color}
                    strokeWidth="2"
                    opacity="0.7"
                    style={{ animation: 'nodeRing 1.5s ease-out infinite', transformOrigin: `${x}px ${y}px` }}
                  />
                )}
                {/* Node background circle */}
                <circle
                  cx={x} cy={y}
                  r={active ? 22 : 18}
                  fill={active ? `${node.color}28` : 'rgba(10,15,25,0.95)'}
                  stroke={active ? node.color : selectedNode === node.id ? '#FFFFFF' : `${node.color}50`}
                  strokeWidth={active ? 2.5 : 1.5}
                  style={active ? { filter: `drop-shadow(0 0 14px ${node.color})`, transition: 'all 0.3s' } : { transition: 'all 0.3s' }}
                />
                {/* Lucide icon using foreignObject */}
                <foreignObject
                  x={x - (active ? 11 : 9)}
                  y={y - (active ? 11 : 9)}
                  width={active ? 22 : 18}
                  height={active ? 22 : 18}
                  style={{ overflow: 'visible', pointerEvents: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Icon style={{ color: active ? '#fff' : node.color, width: active ? '14px' : '11px', height: active ? '14px' : '11px' }} />
                  </div>
                </foreignObject>
                {/* Label */}
                <text
                  x={x}
                  y={y + (active ? 34 : 29)}
                  textAnchor="middle"
                  fill={active ? '#FFFFFF' : '#94A3B8'}
                  fontSize={active ? '11' : '10'}
                  fontWeight={active ? '700' : '500'}
                  fontFamily="'Space Grotesk', sans-serif"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.label.length > 18 ? node.label.slice(0, 17) + 'â€¦' : node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node Inspector */}
      {selectedNode && (() => {
        const n = NODE_META.find(m => m.id === selectedNode);
        if (!n) return null;
        return (
          <div style={{
            marginTop: '14px',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${n.color}40`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: n.color }}>{n.label}</span>
                <span className="badge" style={{ background: `${n.color}22`, color: n.color, fontSize: '0.65rem' }}>{n.role}</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{n.desc}</p>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="cyber-button cyber-button-outline"
              style={{ padding: '4px 10px', fontSize: '0.72rem' }}
            >
              Close Inspector
            </button>
          </div>
        );
      })()}
    </div>
  );
}

