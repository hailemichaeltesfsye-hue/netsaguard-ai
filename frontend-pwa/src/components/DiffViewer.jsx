import React from 'react';
import { Columns, ShieldCheck, Eye, EyeOff, Radio, Lock } from 'lucide-react';

export default function DiffViewer({ rawText, piiData, antiCensorshipData, language }) {
  if (!piiData && !antiCensorshipData) {
    return null;
  }

  const sanitizedText = piiData?.sanitized_text || rawText;
  const redactedEntities = piiData?.redacted_entities || [];
  const platformRisks = antiCensorshipData?.simulated_platform_risk || {
    twitter_x: 0.12,
    facebook_meta: 0.18,
    telegram: 0.04,
    tiktok: 0.15
  };

  return (
    <div className="cyber-card" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Columns style={{ color: 'var(--electric-cyan)', width: '18px', height: '18px' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Holographic Diff & Platform Bypass Sandbox</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-crimson">
            <Lock style={{ width: '12px', height: '12px' }} />
            {redactedEntities.length} PII Entities Redacted
          </span>
          <span className="badge badge-emerald">
            <ShieldCheck style={{ width: '12px', height: '12px' }} />
            Bypass Evasion: {((antiCensorshipData?.evasion_confidence || 0.94) * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left Column: Raw Input (Flagged) */}
        <div style={{ background: 'rgba(255, 51, 102, 0.03)', border: '1px solid rgba(255, 51, 102, 0.25)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--neon-crimson)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye style={{ width: '14px', height: '14px' }} />
              RAW DEFENDER INPUT (UNPROTECTED)
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Original Text</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', fontFamily: language === 'amharic' ? 'var(--font-ethiopic)' : 'var(--font-sans)', whiteSpace: 'pre-wrap' }}>
            {rawText}
          </p>
        </div>

        {/* Right Column: Sanitized & Anti-Censorship Optimized */}
        <div style={{ background: 'rgba(0, 255, 163, 0.03)', border: '1px solid rgba(0, 255, 163, 0.35)', borderRadius: 'var(--radius-sm)', padding: '16px', boxShadow: '0 0 25px rgba(0, 255, 163, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--cyber-emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck style={{ width: '14px', height: '14px' }} />
              EDGE GOVERNANCE & OBFUSCATED PAYLOAD
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>SAFE TO BROADCAST</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.6', fontFamily: language === 'amharic' ? 'var(--font-ethiopic)' : 'var(--font-sans)', whiteSpace: 'pre-wrap' }}>
            {sanitizedText}
          </p>
        </div>
      </div>

      {/* Redacted Token Badges */}
      {redactedEntities.length > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Masked African Tokens:</span>
          {redactedEntities.map((item, idx) => (
            <span key={idx} className="badge badge-crimson" style={{ fontSize: '0.7rem' }}>
              {item.entity_type}: {item.original || item.original_mask} → {item.mask || item.original_mask}
            </span>
          ))}
        </div>
      )}

      {/* Platform Censorship Simulation Meters */}
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Radio style={{ width: '14px', height: '14px', color: 'var(--electric-cyan)' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Simulated Platform Censorship Vulnerability (Lower is Safer):
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          {Object.entries(platformRisks).map(([platform, risk]) => {
            const riskPct = (risk * 100).toFixed(0);
            const isLowRisk = risk < 0.25;
            return (
              <div key={platform} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginBottom: '4px' }}>
                  <span>{platform.replace('_', ' ')}</span>
                  <span style={{ color: isLowRisk ? 'var(--cyber-emerald)' : 'var(--glowing-amber)', fontWeight: 600 }}>{riskPct}% Risk</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${riskPct}%`, height: '100%', background: isLowRisk ? 'var(--cyber-emerald)' : 'var(--glowing-amber)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
