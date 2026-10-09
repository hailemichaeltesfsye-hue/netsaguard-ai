import React, { useState } from 'react';
import { Award, ShieldCheck, Copy, Check, ExternalLink, Key, Hash, FileCheck, CheckCircle2 } from 'lucide-react';

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
    <div 
      className="cyber-card" 
      style={{ 
        padding: '24px', 
        marginBottom: '24px',
        border: '1.5px solid var(--cyber-emerald)',
        boxShadow: '0 0 35px var(--cyber-emerald-glow)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(0, 255, 163, 0.25) 0%, rgba(0, 229, 255, 0.15) 100%)',
            border: '1.5px solid var(--cyber-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--cyber-emerald-glow)'
          }}>
            <Award style={{ color: 'var(--cyber-emerald)', width: '22px', height: '22px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                Decentralized Cryptographic Audit Manifest
              </h3>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>TAMPER-PROOF VERIFIED</span>
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--cyber-emerald)' }}>
              MCP Tool: <code>generate_signed_compliance_report()</code> Certified
            </span>
          </div>
        </div>

        <button 
          onClick={handleCopy} 
          className="cyber-button cyber-button-outline" 
          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
        >
          {copied ? <Check style={{ width: '15px', height: '15px', color: 'var(--cyber-emerald)' }} /> : <Copy style={{ width: '15px', height: '15px' }} />}
          {copied ? 'Audit Manifest Copied!' : 'Export JSON Audit Packet'}
        </button>
      </div>

      {/* Manifest Data Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '16px' }}>
        {/* SHA-256 */}
        <div style={{ background: 'rgba(5, 8, 14, 0.75)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <Hash style={{ width: '14px', height: '14px', color: 'var(--cyber-emerald)' }} />
            <span style={{ fontWeight: 600 }}>Payload SHA-256 Hash Digest</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
            {manifest.payload_sha256}
          </p>
        </div>

        {/* HMAC Signature */}
        <div style={{ background: 'rgba(5, 8, 14, 0.75)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <Key style={{ width: '14px', height: '14px', color: 'var(--electric-cyan)' }} />
            <span style={{ fontWeight: 600 }}>HMAC-SHA256 Digital Signature</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--electric-cyan)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
            {manifest.hmac_signature}
          </p>
        </div>
      </div>

      {/* Footer Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.76rem', color: 'var(--text-muted)', paddingTop: '14px', borderTop: '1px solid var(--border-glass)' }}>
        <span>Signer Authority: <strong style={{ color: 'var(--text-primary)' }}>{manifest.signer_identity}</strong></span>
        <span>IPFS CID: <code style={{ color: 'var(--cyber-emerald)', background: 'rgba(0, 255, 163, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>{manifest.ipfs_cid_mock}</code></span>
        <span>Certified At: {new Date(manifest.issued_at).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
