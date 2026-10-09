import React from 'react';
import { Shield, Activity, Globe, Cpu, Radio, Sparkles } from 'lucide-react';

export default function Header({ 
  selectedLanguage, 
  onLanguageChange, 
  isExecuting, 
  isConnectedToLangSmith = true,
  activeAgent = 'supervisor',
  threadId
}) {
  const languages = [
    { code: 'english', label: 'English (Diaspora / Global)', flag: '🌐' },
    { code: 'amharic', label: 'አማርኛ (Amharic)', flag: '🇪🇹' },
    { code: 'swahili', label: 'Kiswahili (Swahili)', flag: '🇰🇪' },
    { code: 'afaan_oromo', label: 'Afaan Oromoo', flag: '🇪🇹' },
    { code: 'hausa', label: 'Hausa', flag: '🇳🇬' },
    { code: 'french', label: 'Français (Sahel)', flag: '🌍' }
  ];

  const agentDisplayMap = {
    supervisor: { name: 'Supervisor Coordinator', color: 'var(--cyber-emerald)' },
    linguistic_specialist: { name: 'Linguistic Specialist', color: 'var(--electric-cyan)' },
    disinformation_forensics: { name: 'Disinformation Forensics', color: 'var(--glowing-amber)' },
    compliance_anticensorship: { name: 'Anti-Censorship Engine', color: 'var(--cyber-violet)' },
    creative_optimization: { name: 'Creative Reach Optimizer', color: '#FB923C' },
    critic_judge: { name: 'Critic & Judge (Quality Gate)', color: 'var(--neon-crimson)' },
    pii_sanitizer: { name: 'Edge Governance PII Scrubber', color: '#10B981' },
    hitl_approval_checkpoint: { name: 'HITL Moderator Checkpoint', color: 'var(--glowing-amber)' },
    finalizer_manifest: { name: 'HMAC Cryptographic Finalizer', color: 'var(--cyber-emerald)' },
    idle: { name: 'Multi-Agent Mesh Ready', color: 'var(--cyber-emerald)' }
  };

  const currentAgentInfo = agentDisplayMap[activeAgent] || agentDisplayMap.supervisor;

  return (
    <header className="cyber-card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ 
          width: '46px', 
          height: '46px', 
          borderRadius: '12px', 
          background: 'linear-gradient(135deg, rgba(0, 255, 163, 0.25) 0%, rgba(0, 229, 255, 0.15) 100%)', 
          border: '1.5px solid var(--cyber-emerald)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 20px var(--cyber-emerald-glow)'
        }}>
          <Shield style={{ color: 'var(--cyber-emerald)', width: '26px', height: '26px' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ 
              fontSize: '1.35rem', 
              fontWeight: 800, 
              letterSpacing: '-0.02em', 
              background: 'linear-gradient(90deg, #FFFFFF 0%, #00FFA3 60%, #00E5FF 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              NetsaGuard AI
            </h1>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>AFRICA DEFENSE V1.0</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Decentralized Privacy-Preserving Agentic Content Hub & Multilingual Anti-Censorship
          </p>
        </div>
      </div>

      {/* Active Agent Radar & Multilingual Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {/* Active Node Live Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-glass)'
        }}>
          <Cpu style={{ width: '15px', height: '15px', color: currentAgentInfo.color }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Agent Node</span>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: currentAgentInfo.color }}>
              {currentAgentInfo.name}
            </span>
          </div>
        </div>

        {/* Multilingual Selector */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'rgba(255, 255, 255, 0.04)', 
          padding: '6px 14px', 
          borderRadius: 'var(--radius-sm)', 
          border: '1px solid var(--border-glass-bright)' 
        }}>
          <Globe style={{ width: '16px', height: '16px', color: 'var(--cyber-emerald)' }} />
          <select 
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.86rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {languages.map(l => (
              <option key={l.code} value={l.code} style={{ background: '#090E17', color: '#FFF' }}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* LangSmith Telemetry Badge */}
        <div className="badge badge-cyan" title="Connected to LangSmith / Arize AgentOps Tracing">
          <Activity style={{ width: '13px', height: '13px' }} />
          <span>AgentOps: ACTIVE</span>
        </div>

        {/* Live Execution Pulse */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={isExecuting ? 'pulse-dot-amber' : 'pulse-dot-emerald'} />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isExecuting ? 'var(--glowing-amber)' : 'var(--cyber-emerald)' }}>
            {isExecuting ? 'ORCHESTRATING...' : 'NODE READY'}
          </span>
        </div>
      </div>
    </header>
  );
}
