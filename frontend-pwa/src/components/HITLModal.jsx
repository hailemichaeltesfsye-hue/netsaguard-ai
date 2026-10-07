import React, { useState } from 'react';
import { PauseCircle, CheckCircle, XCircle, FileSignature, ShieldAlert, Sparkles } from 'lucide-react';

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

  const piiRedactedCount = campaignState?.pii_sanitization?.redacted_entities?.length || 0;
  const criticScore = campaignState?.critic_evaluation?.overall_score || 0;
  const targetLang = campaignState?.target_language || 'amharic';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 8, 14, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="cyber-card" style={{
        maxWidth: '680px',
        width: '100%',
        padding: '30px',
        border: '1.5px solid var(--glowing-amber)',
        boxShadow: 'var(--shadow-amber)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              background: 'rgba(255, 184, 0, 0.15)', 
              border: '1px solid var(--glowing-amber)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <PauseCircle style={{ color: 'var(--glowing-amber)', width: '24px', height: '24px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Human-in-the-Loop (HITL) Checkpoint
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--glowing-amber)' }}>
                LangGraph State Execution Paused at <code>interrupt_before</code> Node
              </p>
            </div>
          </div>
          <span className="badge badge-amber">AWAITING MODERATOR SIGN-OFF</span>
        </div>

        {/* Status Metrics Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Critic Score</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--cyber-emerald)' }}>{criticScore}/100</span>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>PII Scrubbed</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--neon-crimson)' }}>{piiRedactedCount} Entities</span>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Target Script</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--electric-cyan)', textTransform: 'uppercase' }}>{targetLang}</span>
          </div>
        </div>

        {/* Editable Preview Sandbox */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Review & Adjust Sanitized Broadcast Content:
          </label>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className={targetLang === 'amharic' ? 'lang-amharic' : ''}
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              background: 'rgba(5, 8, 14, 0.8)',
              border: '1px solid var(--border-glass-bright)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              lineHeight: '1.6',
              outline: 'none',
              fontFamily: targetLang === 'amharic' ? 'var(--font-ethiopic)' : 'var(--font-sans)'
            }}
          />
        </div>

        {/* Reviewer Multi-Sig Notes */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Moderator Attestation Notes (Appended to HMAC Signed Manifest):
          </label>
          <input
            type="text"
            value={reviewerNotes}
            onChange={(e) => setReviewerNotes(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'rgba(5, 8, 14, 0.8)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={onReject}
            disabled={isResuming}
            className="btn-cyber-secondary"
            style={{ borderColor: 'rgba(255, 51, 102, 0.4)', color: 'var(--neon-crimson)' }}
          >
            <XCircle style={{ width: '16px', height: '16px' }} />
            Reject Campaign
          </button>

          <button
            onClick={() => onApprove({ reviewerNotes, editedText })}
            disabled={isResuming}
            className="btn-cyber-primary"
          >
            {isResuming ? (
              <>
                <Sparkles style={{ width: '16px', height: '16px', animation: 'spin 2s linear infinite' }} />
                Signing Cryptographic Manifest...
              </>
            ) : (
              <>
                <CheckCircle style={{ width: '16px', height: '16px' }} />
                Approve & Cryptographically Sign
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
