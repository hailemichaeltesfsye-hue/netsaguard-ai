import React, { useState } from 'react';
import { 
  PauseCircle, CheckCircle, XCircle, FileSignature, ShieldAlert, 
  Sparkles, AlertTriangle, Lock, Eye, Edit3, ArrowRight, ShieldCheck 
} from 'lucide-react';

export default function HITLModal({ 
  isOpen, 
  campaignState, 
  onApprove, 
  onReject, 
  isResuming 
}) {
  if (!isOpen || !campaignState) return null;

  const [reviewerNotes, setReviewerNotes] = useState(
    'Certified for public distribution across African digital rights relays.'
  );
  const [editedText, setEditedText] = useState(
    campaignState?.pii_sanitization?.sanitized_text || campaignState?.input_text || ''
  );
  const [activeTab, setActiveTab] = useState('diff'); // 'diff' or 'editor'

  const piiData = campaignState?.pii_sanitization;
  const piiRedactedCount = piiData?.redacted_entities?.length || 0;
  const phonesCount = piiData?.phone_numbers_redacted || 0;
  const namesCount = piiData?.names_redacted || 0;
  const locsCount = piiData?.locations_redacted || 0;
  const criticScore = campaignState?.critic_evaluation?.overall_score || 0;
  const targetLang = campaignState?.target_language || 'amharic';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(3, 5, 10, 0.88)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div 
        className="cyber-card hitl-portal-pulse" 
        style={{
          maxWidth: '820px',
          width: '100%',
          padding: '34px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(11, 16, 28, 0.95)',
          border: '2px solid var(--glowing-amber)',
          boxShadow: '0 0 60px rgba(255, 184, 0, 0.45)',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        {/* Portal Security Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              background: 'rgba(255, 184, 0, 0.15)', 
              border: '2px solid var(--glowing-amber)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 184, 0, 0.4)'
            }}>
              <PauseCircle style={{ color: 'var(--glowing-amber)', width: '28px', height: '28px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  HITL SECURITY VALIDATION PORTAL
                </h3>
                <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>PAUSED AT CHECKPOINT</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--glowing-amber)', marginTop: '2px' }}>
                LangGraph Multi-Agent execution halted at <code>interrupt_before=["hitl_approval_node"]</code>. Awaiting human moderator signature.
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Threat & Scrubbing Metrics Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Critic Quality Gate</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cyber-emerald)' }}>{criticScore}/100</span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Phones Scrubbed</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neon-crimson)' }}>{phonesCount} Local</span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Names & Locs</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--electric-cyan)' }}>{namesCount + locsCount} Masked</span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Target Script</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase' }}>{targetLang}</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          <button
            onClick={() => setActiveTab('diff')}
            className={`cyber-button ${activeTab === 'diff' ? 'cyber-button-outline' : ''}`}
            style={{ 
              padding: '6px 14px', 
              fontSize: '0.78rem',
              borderColor: activeTab === 'diff' ? 'var(--cyber-emerald)' : 'transparent',
              color: activeTab === 'diff' ? 'var(--cyber-emerald)' : 'var(--text-secondary)'
            }}
          >
            <Eye style={{ width: '14px', height: '14px' }} /> Side-by-Side Redaction Diff
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`cyber-button ${activeTab === 'editor' ? 'cyber-button-outline' : ''}`}
            style={{ 
              padding: '6px 14px', 
              fontSize: '0.78rem',
              borderColor: activeTab === 'editor' ? 'var(--cyber-emerald)' : 'transparent',
              color: activeTab === 'editor' ? 'var(--cyber-emerald)' : 'var(--text-secondary)'
            }}
          >
            <Edit3 style={{ width: '14px', height: '14px' }} /> Interactive Moderator Editor
          </button>
        </div>

        {/* Tab 1: Side-by-Side Diff */}
        {activeTab === 'diff' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 51, 102, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <AlertTriangle style={{ color: 'var(--neon-crimson)', width: '14px', height: '14px' }} />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--neon-crimson)', textTransform: 'uppercase' }}>Raw Defender Text (Unsanitized)</span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {campaignState?.input_text}
              </p>
            </div>

            <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0, 255, 163, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <ShieldCheck style={{ color: 'var(--cyber-emerald)', width: '14px', height: '14px' }} />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--cyber-emerald)', textTransform: 'uppercase' }}>Edge-Governed Output (Safe)</span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#FFFFFF', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {editedText}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Live Moderator Textarea Editor */}
        {activeTab === 'editor' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              Modify Broadcast Text Prior to Cryptographic Certification:
            </label>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className={targetLang === 'amharic' ? 'lang-amharic' : ''}
              style={{
                width: '100%',
                minHeight: '130px',
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(5, 8, 14, 0.8)',
                border: '1.5px solid var(--electric-cyan)',
                color: '#FFFFFF',
                fontFamily: targetLang === 'amharic' ? 'var(--font-ethiopic)' : 'var(--font-sans)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>
        )}

        {/* Moderator Audit Notes */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            Moderator Compliance Notes (Persisted to Firestore & Manifest):
          </label>
          <input
            type="text"
            value={reviewerNotes}
            onChange={(e) => setReviewerNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(5, 8, 14, 0.8)',
              border: '1px solid var(--border-glass-bright)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.84rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Physical Action Buttons Cluster */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={onReject}
            disabled={isResuming}
            className="cyber-button cyber-button-crimson"
            style={{ padding: '12px 24px' }}
          >
            <XCircle style={{ width: '18px', height: '18px' }} />
            Reject & Quarantine
          </button>

          <button
            onClick={() => onApprove({ reviewerNotes, editedText })}
            disabled={isResuming}
            className="cyber-button cyber-button-emerald"
            style={{ padding: '12px 32px', fontSize: '0.96rem', letterSpacing: '0.02em' }}
          >
            {isResuming ? (
              <>
                <span className="pulse-dot-amber" />
                Signing Cryptographic Manifest...
              </>
            ) : (
              <>
                <FileSignature style={{ width: '18px', height: '18px' }} />
                AUTHORIZE & CRYPTOGRAPHICALLY SIGN
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
