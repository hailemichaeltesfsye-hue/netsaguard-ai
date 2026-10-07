/**
 * NetsaGuard AI: Firebase Firestore & Admin Connector
 * Connects to Firebase Firestore for immutable campaign audit logging,
 * with fallback in-memory mock store for offline hackathon demonstrations.
 */

const admin = require('firebase-admin');
require('dotenv').config();

let db;
const memoryStore = new Map();

const useMock = process.env.USE_MOCK_FIREBASE === 'true' || !process.env.FIREBASE_PROJECT_ID;

if (useMock) {
  console.log('[NetsaGuard Firebase Bridge] Running in MOCK/OFFLINE mode. Memory Store initialized.');
  db = {
    collection: (collName) => ({
      doc: (docId) => ({
        set: async (data) => {
          const key = `${collName}:${docId}`;
          memoryStore.set(key, { ...data, updatedAt: new Date().toISOString() });
          return { writeTime: new Date() };
        },
        get: async () => {
          const key = `${collName}:${docId}`;
          const data = memoryStore.get(key);
          return {
            exists: !!data,
            data: () => data
          };
        },
        update: async (data) => {
          const key = `${collName}:${docId}`;
          const existing = memoryStore.get(key) || {};
          memoryStore.set(key, { ...existing, ...data, updatedAt: new Date().toISOString() });
          return { writeTime: new Date() };
        }
      }),
      orderBy: () => ({
        limit: () => ({
          get: async () => {
            const docs = [];
            for (const [k, v] of memoryStore.entries()) {
              if (k.startsWith(`${collName}:`)) {
                docs.push({ id: k.split(':')[1], data: () => v });
              }
            }
            return { docs };
          }
        })
      })
    })
  };
} else {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    db = admin.firestore();
    console.log('[NetsaGuard Firebase Bridge] Connected to live Firebase Firestore.');
  } catch (err) {
    console.warn('[NetsaGuard Firebase Bridge] Firebase initialization failed, falling back to mock:', err.message);
    db = memoryStore;
  }
}

module.exports = { db, isMock: useMock };
