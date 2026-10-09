/**
 * NetsaGuard AI: Express Gateway Server
 * Bridges React Afro-Cyber PWA, Firebase Firestore, and Python LangGraph Engine.
 * Features real-time SSE streaming for LangSmith/Arize trace arrays.
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { db, isMock } = require('./config/firebase');
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
    firebase_mode: isMock ? 'IN_MEMORY_MOCK' : 'LIVE_FIRESTORE',
    python_agent_url: PYTHON_AGENT_URL,
    supported_languages: ['amharic', 'swahili', 'afaan_oromo', 'french', 'hausa', 'english'],
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
    }, { timeout: 15000 });

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
      langsmith_trace_id: graphOutput.state?.langsmith_trace_id || null,
      arize_trace_id: graphOutput.state?.arize_trace_id || null,
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
    }, { timeout: 15000 });

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

// Real-Time Server-Sent Events (SSE) Proxy for live trace streaming
app.get('/api/campaigns/stream/:threadId', async (req, res) => {
  const { threadId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const streamRes = await axios.get(`${PYTHON_AGENT_URL}/api/campaign/stream/${threadId}`, {
      responseType: 'stream',
      timeout: 30000
    });

    streamRes.data.on('data', chunk => {
      res.write(chunk);
    });

    streamRes.data.on('end', () => {
      res.end();
    });

    req.on('close', () => {
      streamRes.data.destroy();
    });
  } catch (err) {
    // Fallback heartbeat event if stream cannot connect
    res.write(`data: ${JSON.stringify({ event: 'STREAM_CONNECTED', thread_id: threadId, status: 'CONNECTED_LOCAL' })}\n\n`);
    res.end();
  }
});

// Stream ongoing LangSmith / Arize trace arrays directly to the UI
app.get('/api/campaigns/traces/:threadId', async (req, res) => {
  const { threadId } = req.params;
  try {
    const traceRes = await axios.get(`${PYTHON_AGENT_URL}/api/campaign/traces/${threadId}`, { timeout: 5000 });
    res.json({ success: true, ...traceRes.data });
  } catch (err) {
    // Fetch cached trace snapshot from Firestore if Python server is unreachable
    try {
      const doc = await db.collection('campaigns').doc(threadId).get();
      if (doc.exists) {
        const data = doc.data();
        const logs = data.state?.execution_logs || [];
        return res.json({
          success: true,
          thread_id: threadId,
          langsmith_trace_id: data.langsmith_trace_id || `ls_${threadId}`,
          arize_trace_id: data.arize_trace_id || `arize_${threadId}`,
          total_tokens_processed: data.state?.total_tokens_processed || 0,
          traces: logs.map((l, i) => ({ step_index: i + 1, ...l }))
        });
      }
    } catch (_) {}

    res.status(500).json({
      error: 'Failed to retrieve agent trace array',
      details: err.message
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

// List recent campaigns
app.get('/api/campaigns', async (req, res) => {
  try {
    const snapshot = await db.collection('campaigns').orderBy('created_at', 'desc').limit(20).get();
    const campaigns = [];
    snapshot.docs.forEach(doc => {
      campaigns.push(doc.data());
    });
    res.json({ success: true, count: campaigns.length, campaigns });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[NetsaGuard Node Bridge] Listening on http://localhost:${PORT}`);
  console.log(`[NetsaGuard Node Bridge] Routing requests to Python Core: ${PYTHON_AGENT_URL}`);
});
