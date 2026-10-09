import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MatrixCanvas from './components/MatrixCanvas';
import NetworkGraph from './components/NetworkGraph';
import CampaignInput from './components/CampaignInput';
import CriticMeter from './components/CriticMeter';
import DiffViewer from './components/DiffViewer';
import HITLModal from './components/HITLModal';
import CryptographicManifest from './components/CryptographicManifest';
import { submitCampaignToAgents, resumeCampaignHITL } from './services/api';
import { CAMPAIGN_PRESETS } from './utils/mockData';
import { Terminal, Shield, Activity, Radio, Cpu, Layers } from 'lucide-react';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [inputText, setInputText] = useState(CAMPAIGN_PRESETS[0].text);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [isHitlModalOpen, setIsHitlModalOpen] = useState(false);
  const [campaignState, setCampaignState] = useState(null);
  const [activeAgent, setActiveAgent] = useState('idle');

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
    setActiveAgent('supervisor');

    // Dynamic agent simulation stepper for visual wow factor while awaiting network response
    const agentSequence = [
      'supervisor',
      'linguistic_specialist',
      'disinformation_forensics',
      'compliance_anticensorship',
      'creative_optimization',
      'critic_judge',
      'pii_sanitizer'
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < agentSequence.length) {
        setActiveAgent(agentSequence[stepIndex]);
      }
    }, 450);

    try {
      const response = await submitCampaignToAgents({
        inputText,
        targetLanguage: selectedLanguage,
        threadId: `thread_${Date.now()}`
      });

      clearInterval(interval);

      if (response && response.data) {
        setCampaignState(response.data);
        if (response.status === 'WAITING_FOR_HUMAN_APPROVAL') {
          setActiveAgent('hitl_approval_checkpoint');
          setIsHitlModalOpen(true);
        } else {
          setActiveAgent('finalizer_manifest');
        }
      }
    } catch (err) {
      clearInterval(interval);
      console.error('Pipeline execution error:', err);
      setActiveAgent('idle');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleApproveHITL = async ({ reviewerNotes, editedText }) => {
    if (!campaignState) return;
    setIsResuming(true);
    setActiveAgent('finalizer_manifest');

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
        setActiveAgent('finalizer_manifest');
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
    setActiveAgent('idle');
  };

  const logs = campaignState?.execution_logs || [];

  return (
    <>
      {/* Animated 2D Agentic Matrix Canvas Backdrop */}
      <MatrixCanvas activeAgent={activeAgent} />

      {/* Main HUD Presentation Container */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1440px', margin: '0 auto', padding: '24px 20px 60px' }}>
        {/* Top Cyber Header */}
        <Header
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          isExecuting={isExecuting}
          isConnectedToLangSmith={true}
          activeAgent={activeAgent}
          threadId={campaignState?.thread_id}
        />

        {/* Live Interactive LangGraph Flow Graph Radar */}
        <NetworkGraph
          currentNode={campaignState?.current_node || (isExecuting ? activeAgent : 'idle')}
          revisionCount={campaignState?.revision_count || 0}
          isCompleted={campaignState?.is_completed || false}
          hitlPaused={isHitlModalOpen || campaignState?.hitl_status === 'PENDING'}
          nodeLatencies={campaignState?.node_latencies || {}}
        />

        {/* Main Two-Column Workflow Deck */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 0.75fr)', gap: '24px', marginBottom: '24px' }}>
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

            {/* AgentOps Execution Stream Card */}
            <div className="cyber-card" style={{ padding: '18px', flexGrow: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal style={{ color: 'var(--cyber-emerald)', width: '16px', height: '16px' }} />
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>AgentOps Real-Time Trace Log</h4>
                </div>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                  LANGSMITH V2
                </span>
              </div>
              
              <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {logs.length === 0 ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Buffer ready. Awaiting multi-agent graph invocation.
                  </span>
                ) : (
                  logs.map((log, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        fontSize: '0.72rem', 
                        fontFamily: 'var(--font-mono)', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        color: 'var(--text-secondary)',
                        padding: '3px 6px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '4px'
                      }}
                    >
                      <span style={{ color: 'var(--cyber-emerald)', fontWeight: 600 }}>[{log.node_name}]</span>
                      <span style={{ color: log.status === 'PASSED' || log.status === 'SUCCESS' ? 'var(--electric-cyan)' : 'var(--glowing-amber)' }}>
                        {log.status}
                      </span>
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

        {/* Interactive Human-in-the-Loop (HITL) Security Validation Portal */}
        <HITLModal
          isOpen={isHitlModalOpen}
          campaignState={campaignState}
          onApprove={handleApproveHITL}
          onReject={handleRejectHITL}
          isResuming={isResuming}
        />
      </div>
    </>
  );
}
