import React from 'react';
import { Send, Sparkles, BookOpen, AlertCircle, FileText, Zap } from 'lucide-react';
import { CAMPAIGN_PRESETS } from '../utils/mockData';

export default function CampaignInput({ 
  inputText, 
  setInputText, 
  selectedLanguage, 
  onSelectPreset, 
  onSubmit, 
  isExecuting 
}) {
  return (
    <div className="cyber-card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(0, 255, 163, 0.12)',
              border: '1px solid var(--cyber-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText style={{ color: 'var(--cyber-emerald)', width: '18px', height: '18px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Digital Rights Broadcast Terminal
              </h3>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Multilingual input with zero-knowledge PII sanitization
              </span>
            </div>
          </div>
          <span className="badge badge-emerald">
            NATIVE {selectedLanguage.toUpperCase()}
          </span>
        </div>

        {/* Preset Quick Loader Buttons */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <BookOpen style={{ width: '13px', height: '13px', color: 'var(--cyber-emerald)' }} />
            <span>Load Verified Hackathon Defense Presets:</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CAMPAIGN_PRESETS.map((preset) => {
              const isSelected = selectedLanguage === preset.language;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`cyber-button ${isSelected ? 'cyber-button-emerald' : 'cyber-button-outline'}`}
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.74rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {preset.title.split('(')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Multilingual Textarea */}
        <div style={{ position: 'relative', marginTop: '12px' }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Enter campaign text or digital rights broadcast in ${selectedLanguage}...`}
            className={selectedLanguage === 'amharic' ? 'lang-amharic' : ''}
            style={{
              width: '100%',
              minHeight: '165px',
              padding: '16px',
              background: 'rgba(5, 8, 14, 0.75)',
              border: '1.5px solid var(--border-glass-bright)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              lineHeight: '1.65',
              resize: 'vertical',
              outline: 'none',
              fontFamily: selectedLanguage === 'amharic' ? 'var(--font-ethiopic)' : 'var(--font-sans)',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--cyber-emerald)';
              e.target.style.boxShadow = '0 0 15px var(--cyber-emerald-glow)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-glass-bright)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            <span>Tokens: ~{inputText ? inputText.split(/\s+/).filter(Boolean).length : 0} | Characters: {inputText.length}</span>
            <span style={{ color: 'var(--cyber-emerald)' }}>✓ PII Sanitizer Armed (+251, +254, +234, +221)</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
          <AlertCircle style={{ width: '14px', height: '14px', color: 'var(--glowing-amber)' }} />
          <span>Self-Healing Loop automatically triggers rewrite if score &lt; 80%.</span>
        </div>
        
        <button
          onClick={onSubmit}
          disabled={!inputText.trim() || isExecuting}
          className="cyber-button cyber-button-emerald"
          style={{ padding: '12px 28px', fontSize: '0.94rem' }}
        >
          {isExecuting ? (
            <>
              <Sparkles style={{ width: '16px', height: '16px' }} />
              Orchestrating Multi-Agent Pipeline...
            </>
          ) : (
            <>
              <Zap style={{ width: '16px', height: '16px' }} />
              INITIATE MULTI-AGENT PIPELINE
            </>
          )}
        </button>
      </div>
    </div>
  );
}
