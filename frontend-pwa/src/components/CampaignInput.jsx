import React from 'react';
import { Send, Sparkles, BookOpen, AlertCircle, FileText } from 'lucide-react';
import { CAMPAIGN_PRESETS } from '../utils/mockData';

export default function CampaignInput({ 
  inputText, 
  setInputText, 
  selectedLanguage, 
  onSelectPreset, 
  onSubmit, 
  isExecuting 
}) {
  const currentPresets = CAMPAIGN_PRESETS.filter(p => p.language === selectedLanguage);

  return (
    <div className="cyber-card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText style={{ color: 'var(--cyber-emerald)', width: '18px', height: '18px' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Digital Rights Broadcast Terminal</h3>
          </div>
          <span className="badge badge-emerald">
            NATIVE {selectedLanguage.toUpperCase()} MODE
          </span>
        </div>

        {/* Preset Quick Loader Buttons */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <BookOpen style={{ width: '14px', height: '14px' }} />
            <span>Load Capstone Evaluation Scenarios:</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CAMPAIGN_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="btn-cyber-secondary"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  borderColor: selectedLanguage === preset.language ? 'var(--cyber-emerald)' : 'var(--border-glass)',
                  color: selectedLanguage === preset.language ? 'var(--cyber-emerald)' : 'var(--text-secondary)'
                }}
              >
                {preset.title.split('(')[0]}
              </button>
            ))}
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
              minHeight: '160px',
              padding: '16px',
              background: 'rgba(5, 8, 14, 0.7)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              lineHeight: '1.6',
              resize: 'vertical',
              outline: 'none',
              fontFamily: selectedLanguage === 'amharic' ? 'var(--font-ethiopic)' : 'var(--font-sans)',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--cyber-emerald)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Tokens: ~{inputText ? inputText.split(/\s+/).filter(Boolean).length : 0} | Characters: {inputText.length}</span>
            <span>Zero-Knowledge PII Scrubber Armed</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <AlertCircle style={{ width: '14px', height: '14px', color: 'var(--glowing-amber)' }} />
          <span>Self-Healing Loop will auto-correct high risk scores.</span>
        </div>
        
        <button
          onClick={onSubmit}
          disabled={!inputText.trim() || isExecuting}
          className="btn-cyber-primary"
        >
          {isExecuting ? (
            <>
              <Sparkles style={{ width: '16px', height: '16px', animation: 'spin 2s linear infinite' }} />
              Executing Agents...
            </>
          ) : (
            <>
              <Send style={{ width: '16px', height: '16px' }} />
              Initiate Multi-Agent Pipeline
            </>
          )}
        </button>
      </div>
    </div>
  );
}
