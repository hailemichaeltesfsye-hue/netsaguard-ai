import React, { useState } from 'react';
import Header from './components/Header';
import NetworkGraph from './components/NetworkGraph';
import CampaignInput from './components/CampaignInput';
import CriticMeter from './components/CriticMeter';
import DiffViewer from './components/DiffViewer';
import HITLModal from './components/HITLModal';
import CryptographicManifest from './components/CryptographicManifest';
import { submitCampaignToAgents, resumeCampaignHITL } from './services/api';
import { CAMPAIGN_PRESETS } from './utils/mockData';
import { Terminal, Shield, Activity } from 'lucide-react';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('amharic');
  const [inputText, setInputText] = useState(CAMPAIGN_PRESETS[0].text);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isHitlModalOpen, setIsHitlModalOpen] = useState(false);
  const [campaignState, setCampaignState] = useState(null);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    const matchingPreset = CAMPAIGN_PRESETS.find(p => p.language === lang);
    if (matchingPreset) {
      setInputText(matchingPreset.text);
    }
  };

  const handleSelectPreset = (preset) => {
    setSelectedLanguage(preset.language);
    setInputText(preset.text);
  };

  const handleStartPipeline = async () => {
    if (!inputText.trim()) return;
    setIsExecuting(true);
    setCampaignState(null);

    try {
      const response = await submitCampaignToAgents({
        inputText,
        targetLanguage: selectedLanguage,
        threadId: `thread_${Date.now()}`
      });

      if (response && response.data) {
        setCampaignState(response.data);
        if (response.status === 'WAITING_FOR_HUMAN_APPROVAL') {
          setIsHitlModalOpen(true);
        }
      }
    } catch (err) {
      console.error('Pipeline execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleApproveHITL = async ({ reviewerNotes, editedText }) => {
    if (!campaignState) return;
    setIsResuming(true);

    try {
      const res = await resumeCampaignHITL({
        threadId: campaignState.thread_id,
        action: 'APPROVE',
        reviewerNotes,
        editedText,
        previousState: campaignState
      });

      if (res && res.data) {
        setCampaignState(res.data);
        setIsHitlModalOpen(false);
      }
    } catch (err) {
      console.error('Resumption error:', err);
    } finally {
      setIsResuming(false);
    }
  };

  const handleRejectHITL = () => {
    if (!campaignState) return;
    setCampaignState(prev => ({
      ...prev,
      hitl_status: 'REJECTED',
      is_completed: true
    }));
    setIsHitlModalOpen(false);
  };

  const logs = campaignState?.execution_logs || [];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Top Cyber Header */}
      <Header
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        isExecuting={isExecuting}
        isConnectedToLangSmith={true}
      />

      {/* Live Interactive LangGraph DAG Radar */}
      <NetworkGraph
        currentNode={campaignState?.current_node || (isExecuting ? 'supervisor' : 'idle')}
        revisionCount={campaignState?.revision_count || 0}
        isCompleted={campaignState?.is_completed || false}
        hitlPaused={isHitlModalOpen || campaignState?.hitl_status === 'PENDING'}
      />

      {/* Main Two-Column Workflow Deck */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '24px', marginBottom: '24px' }}>
        {/* Left Column: Multilingual Broadcast Input Terminal */}
        <CampaignInput
          inputText={inputText}
          setInputText={setInputText}
          selectedLanguage={selectedLanguage}
          onSelectPreset={handleSelectPreset}
          onSubmit={handleStartPipeline}
          isExecuting={isExecuting}
        />

        {/* Right Column: Critic Score Meter & AgentOps Telemetry Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <CriticMeter
            criticData={campaignState?.critic_evaluation}
            revisionCount={campaignState?.revision_count || 0}
            maxRevisions={campaignState?.max_revision_attempts || 3}
          />

          {/* Mini AgentOps Execution Stream */}
          <div className="cyber-card" style={{ padding: '18px', flexGrow: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Terminal style={{ color: 'var(--cyber-emerald)', width: '16px', height: '16px' }} />
              <h4 style={{ fontSize: '0.88rem', fontWeight: 600 }}>LangSmith AgentOps Event Stream</h4>
            </div>
            <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {logs.length === 0 ? (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No active execution events in buffer.</span>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--cyber-emerald)' }}>[{log.node_name}]</span>
                    <span style={{ color: 'var(--electric-cyan)' }}>{log.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Holographic Diff & Platform Bypass Sandbox */}
      {campaignState && (
        <DiffViewer
          rawText={inputText}
          piiData={campaignState.pii_sanitization}
          antiCensorshipData={campaignState.anticensorship_payload}
          language={selectedLanguage}
        />
      )}

      {/* Tamper-Proof Cryptographic Verification Manifest */}
      {campaignState?.cryptographic_manifest && (
        <CryptographicManifest
          manifest={campaignState.cryptographic_manifest}
          finalOutput={campaignState.final_output_text}
          campaignId={campaignState.campaign_id}
          targetLanguage={selectedLanguage}
        />
      )}

      {/* Interactive Human-in-the-Loop (HITL) Modal */}
      <HITLModal
        isOpen={isHitlModalOpen}
        campaignState={campaignState}
        onApprove={handleApproveHITL}
        onReject={handleRejectHITL}
        isResuming={isResuming}
      />
    </div>
  );
}
