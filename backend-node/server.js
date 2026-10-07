/**
 * NetsaGuard AI: Express Gateway Server
 * Bridges React PWA, Firebase Firestore, and Python LangGraph Engine.
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { db } = require('./config/firebase');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const PYTHON_AGENT_URL = process.env.PYTHON_AGENT_URL || 'http://localhost:8000';

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    bridge: 'NetsaGuard Node.js Express Gateway',
    python_agent_url: PYTHON_AGENT_URL,
    timestamp: new Date().toISOString()
  });
});

// Proxy: Submit campaign to Python LangGraph and save in Firestore
app.post('/api/campaigns/process', async (req, res) => {
  const { input_text, target_language, thread_id } = req.body;

  if (!input_text) {
    return res.status(400).json({ error: 'input_text is required.' });
  }

  try {
    // 1. Invoke Python LangGraph Orchestrator
    const pythonRes = await axios.post(`${PYTHON_AGENT_URL}/api/campaign/submit`, {
      input_text,
      target_language: target_language || 'amharic',
      thread_id
    });

    const graphOutput = pythonRes.data;
    const campaignId = graphOutput.state?.campaign_id || `NG-${Date.now()}`;
    const activeThreadId = graphOutput.thread_id;

    // 2. Persist State in Firestore
    await db.collection('campaigns').doc(activeThreadId).set({
      campaign_id: campaignId,
      thread_id: activeThreadId,
      status: graphOutput.status,
      target_language: target_language || 'amharic',
      raw_input: input_text,
      sanitized_output: graphOutput.state?.pii_sanitization?.sanitized_text || null,
      critic_score: graphOutput.state?.critic_evaluation?.overall_score || null,
      revisions: graphOutput.state?.revision_count || 0,
      state: graphOutput.state,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // 3. Return response to React PWA
    res.json({
      success: true,
      campaign_id: campaignId,
      thread_id: activeThreadId,
      status: graphOutput.status,
      data: graphOutput.state
    });
  } catch (err) {
    console.error('[NetsaGuard Node Bridge] Submit error:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to process campaign through Agentic Orchestrator',
      details: err.response?.data || err.message
    });
  }
});

// Proxy: Resume campaign after Human-in-the-Loop review
app.post('/api/campaigns/resume', async (req, res) => {
  const { thread_id, action, reviewer_notes, edited_text } = req.body;

  if (!thread_id) {
    return res.status(400).json({ error: 'thread_id is required for resumption.' });
  }

  try {
    // 1. Call Python LangGraph Resume Endpoint
    const pythonRes = await axios.post(`${PYTHON_AGENT_URL}/api/campaign/resume`, {
      thread_id,
      action: action || 'APPROVE',
      reviewer_notes: reviewer_notes || 'Approved by moderator',
      edited_text
    });

    const finalizedData = pythonRes.data;

    // 2. Update Firestore document
    await db.collection('campaigns').doc(thread_id).update({
      status: finalizedData.status,
      hitl_status: action || 'APPROVED',
      reviewer_notes: reviewer_notes || 'Approved by moderator',
      manifest: finalizedData.state?.cryptographic_manifest || null,
      is_completed: true,
      finalized_at: new Date().toISOString()
    });

    res.json({
      success: true,
      status: finalizedData.status,
      thread_id,
      data: finalizedData.state
    });
  } catch (err) {
    console.error('[NetsaGuard Node Bridge] Resume error:', err.response?.data || err.message);
    res.status(500).json({
      error: 'Failed to resume HITL approval checkpoint',
      details: err.response?.data || err.message
    });
  }
});

// Get campaign by thread_id
app.get('/api/campaigns/:threadId', async (req, res) => {
  try {
    const doc = await db.collection('campaigns').doc(req.params.threadId).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Campaign record not found' });
    }
    res.json({ success: true, campaign: doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[NetsaGuard Node Bridge] Listening on http://localhost:${PORT}`);
});
