import React from 'react';
import { Shield, Activity, Globe, Cpu, Lock, CheckCircle2 } from 'lucide-react';

export default function Header({ selectedLanguage, onLanguageChange, isExecuting, isConnectedToLangSmith }) {
  const languages = [
    { code: 'amharic', label: 'አማርኛ (Amharic)', flag: '🇪🇹' },
    { code: 'swahili', label: 'Kiswahili (Swahili)', flag: '🇰🇪' },
    { code: 'afaan_oromo', label: 'Afaan Oromoo', flag: '🇪🇹' },
    { code: 'hausa', label: 'Hausa', flag: '🇳🇬' },
    { code: 'french', label: 'Français (Sahel)', flag: '🌍' }
  ];

  return (
    <header className="cyber-card" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ 
          width: '44px', 
          height: '44px', 
          borderRadius: '12px', 
          background: 'linear-gradient(135deg, rgba(0, 255, 163, 0.2) 0%, rgba(0, 229, 255, 0.1) 100%)', 
          border: '1px solid var(--cyber-emerald)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 0 15px var(--cyber-emerald-glow)'
        }}>
          <Shield style={{ color: 'var(--cyber-emerald)', width: '24px', height: '24px' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #FFFFFF 0%, #00FFA3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NetsaGuard AI
            </h1>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>AFRICA-DEFENSE V1.0</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Decentralized Privacy-Preserving Agentic Content Hub & Multilingual Anti-Censorship
          </p>
        </div>
      </div>

      {/* Right Action Cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.04)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <Globe style={{ width: '16px', height: '16px', color: 'var(--cyber-emerald)' }} />
          <select 
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {languages.map(l => (
              <option key={l.code} value={l.code} style={{ background: '#0C111A', color: '#FFF' }}>
                {l.flag} {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* LangSmith Telemetry Status */}
        <div className="badge badge-cyan" title="Connected to LangSmith AgentOps Tracing">
          <Activity style={{ width: '13px', height: '13px' }} />
          <span>LangSmith Tracing: ACTIVE</span>
        </div>

        {/* Execution Pulse Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={isExecuting ? 'pulse-dot-amber' : 'pulse-dot-emerald'} />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isExecuting ? 'var(--glowing-amber)' : 'var(--cyber-emerald)' }}>
            {isExecuting ? 'AGENTS ORCHESTRATING...' : 'NODE READY'}
          </span>
        </div>
      </div>
    </header>
  );
}
