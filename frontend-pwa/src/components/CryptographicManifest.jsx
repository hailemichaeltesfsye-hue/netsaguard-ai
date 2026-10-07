import React, { useState } from 'react';
import { Award, ShieldCheck, Copy, Check, ExternalLink, Key, Hash } from 'lucide-react';

export default function CryptographicManifest({ manifest, finalOutput, campaignId, targetLanguage }) {
  const [copied, setCopied] = useState(false);

  if (!manifest) return null;

  const handleCopy = () => {
    const payload = JSON.stringify({
      campaign_id: campaignId,
      target_language: targetLanguage,
      final_broadcast: finalOutput,
      cryptographic_manifest: manifest
    }, null, 2);
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="cyber-card cyber-card-emerald" style={{ padding: '24px', marginBottom: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(0, 255, 163, 0.15)',
            border: '1px solid var(--cyber-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award style={{ color: 'var(--cyber-emerald)', width: '20px', height: '20px' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Decentralized Cryptographic Audit Manifest
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--cyber-emerald)' }}>
              MCP Tool: <code>generate_signed_compliance_report()</code> Certified
            </span>
          </div>
        </div>

        <button onClick={handleCopy} className="btn-cyber-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
          {copied ? <Check style={{ width: '14px', height: '14px', color: 'var(--cyber-emerald)' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
          {copied ? 'Manifest Copied!' : 'Export JSON Audit Packet'}
        </button>
      </div>

      {/* Manifest Data Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '16px' }}>
        {/* SHA-256 */}
        <div style={{ background: 'rgba(5, 8, 14, 0.7)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <Hash style={{ width: '13px', height: '13px', color: 'var(--cyber-emerald)' }} />
            <span>Payload SHA-256 Digest</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
            {manifest.payload_sha256}
          </p>
        </div>

        {/* HMAC Signature */}
        <div style={{ background: 'rgba(5, 8, 14, 0.7)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <Key style={{ width: '13px', height: '13px', color: 'var(--electric-cyan)' }} />
            <span>HMAC-SHA256 Digital Signature</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--electric-cyan)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
            {manifest.hmac_signature}
          </p>
        </div>
      </div>

      {/* Footer Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
        <span>Signer Authority: <strong style={{ color: 'var(--text-secondary)' }}>{manifest.signer_identity}</strong></span>
        <span>IPFS CID: <code style={{ color: 'var(--cyber-emerald)' }}>{manifest.ipfs_cid_mock}</code></span>
        <span>Certified At: {new Date(manifest.issued_at).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
