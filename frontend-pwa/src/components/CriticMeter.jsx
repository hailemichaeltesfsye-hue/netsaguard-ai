import React from 'react';
import { Scale, RefreshCw, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function CriticMeter({ criticData, revisionCount, maxRevisions = 3 }) {
  if (!criticData) {
    return (
      <div className="cyber-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px', textAlign: 'center' }}>
        <Scale style={{ width: '36px', height: '36px', color: 'var(--text-muted)', marginBottom: '12px' }} />
        <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Critic & Judge Engine Idle</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', maxWidth: '280px', marginTop: '6px' }}>
          Submit a campaign to trigger real-time 4-pillar quality analysis and automated self-healing guardrails.
        </p>
      </div>
    );
  }

  const score = criticData.overall_score || 0;
  const isPassed = criticData.passed_threshold || score >= 80;
  const strokeColor = isPassed ? 'var(--cyber-emerald)' : 'var(--glowing-amber)';

  const pillars = [
    { name: 'Linguistic Nuance', score: criticData.linguistic_score || 22.5, max: 25, unit: 'pts' },
    { name: 'Evasion Resilience', score: criticData.evasion_score || 31.0, max: 35, unit: 'pts' },
    { name: 'Threat Cleanliness', score: criticData.forensics_cleanliness || 21.0, max: 25, unit: 'pts' },
    { name: 'Outreach & CTA', score: criticData.reach_score || 14.0, max: 15, unit: 'pts' }
  ];

  return (
    <div className="cyber-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scale style={{ color: strokeColor, width: '18px', height: '18px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Self-Healing Critic & Judge Node</h3>
        </div>
        <span className={`badge ${isPassed ? 'badge-emerald' : 'badge-amber'}`}>
          {isPassed ? 'THRESHOLD MET (≥80%)' : 'HEALING REVISION ACTIVE'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
        {/* Radial Score Gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle
                cx="65" cy="65" r="52"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
              />
              <circle
                cx="65" cy="65" r="52"
                fill="none"
                stroke={strokeColor}
                strokeWidth="10"
                strokeDasharray="326.7"
                strokeDashoffset={326.7 - (326.7 * (score / 100))}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                {score}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '-4px' }}>/100</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
            <RefreshCw style={{ width: '12px', height: '12px', color: 'var(--glowing-amber)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Revision Loop: <strong>{revisionCount} / {maxRevisions}</strong>
            </span>
          </div>
        </div>

        {/* 4 Pillars Progress Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pillars.map((p, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {p.score} / {p.max} {p.unit}
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(p.score / p.max) * 100}%`,
                    height: '100%',
                    background: isPassed ? 'var(--cyber-emerald)' : 'var(--glowing-amber)',
                    borderRadius: '3px',
                    transition: 'width 0.8s ease'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Remediation / Feedback Alert */}
      {criticData.remediation_instructions && (
        <div style={{ 
          marginTop: '16px', 
          padding: '10px 14px', 
          borderRadius: 'var(--radius-sm)', 
          background: isPassed ? 'rgba(0, 255, 163, 0.08)' : 'rgba(255, 184, 0, 0.08)',
          border: `1px solid ${isPassed ? 'rgba(0, 255, 163, 0.2)' : 'rgba(255, 184, 0, 0.2)'}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px'
        }}>
          {isPassed ? (
            <CheckCircle2 style={{ width: '16px', height: '16px', color: 'var(--cyber-emerald)', flexShrink: 0, marginTop: '2px' }} />
          ) : (
            <AlertTriangle style={{ width: '16px', height: '16px', color: 'var(--glowing-amber)', flexShrink: 0, marginTop: '2px' }} />
          )}
          <p style={{ fontSize: '0.76rem', color: isPassed ? 'var(--cyber-emerald)' : 'var(--glowing-amber)', lineHeight: '1.4' }}>
            {criticData.remediation_instructions}
          </p>
        </div>
      )}
    </div>
  );
}
