import React, { useState } from 'react';

const LINKEDIN_URL = 'https://www.linkedin.com/in/hailemichael-tesfaye-2b7114401/';
const GITHUB_URL   = 'https://github.com/hailemichaeltesfsye-hue/netsaguard-ai';
const HACKATHON_URL = 'https://forms.gle/ygJb48Kpk6KLwbGQA';

const FOCAL_CONTACTS = [
  { name: 'Esther Tshimanga', email: 'etshimanga@gmail.com' },
  { name: 'Sinothando Manala', email: 'manala@unfpa.org' },
  { name: 'Bernadette Ssebadduka', email: 'ssebadduka@unfpa.org' },
  { name: 'Nicolette Moodie', email: 'moodie@unfpa.org' },
];

function PulseOrb({ color, size = 8 }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size, marginRight: 6 }}>
      <span style={{
        display: 'block', width: size, height: size, borderRadius: '50%',
        background: color, boxShadow: `0 0 8px ${color}`,
      }} />
      <span style={{
        position: 'absolute', top: -2, left: -2, right: -2, bottom: -2,
        borderRadius: '50%', border: `1.5px solid ${color}`,
        animation: 'footer-ring 1.8s infinite',
      }} />
    </span>
  );
}

export default function Footer() {
  const [year] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes footer-ring {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes footer-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes footer-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        .footer-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          border: 1.5px solid transparent;
          transition: all 0.28s cubic-bezier(0.16,1,0.3,1);
          letter-spacing: 0.01em;
          cursor: pointer;
        }
        .footer-link-linkedin {
          background: rgba(10, 102, 194, 0.14);
          color: #60A5FA;
          border-color: rgba(10, 102, 194, 0.45);
        }
        .footer-link-linkedin:hover {
          background: rgba(10, 102, 194, 0.28);
          border-color: #60A5FA;
          box-shadow: 0 0 22px rgba(96, 165, 250, 0.35);
          transform: translateY(-2px);
        }
        .footer-link-github {
          background: rgba(255, 255, 255, 0.05);
          color: #E2E8F0;
          border-color: rgba(255,255,255,0.18);
        }
        .footer-link-github:hover {
          background: rgba(255,255,255,0.10);
          border-color: #00FFA3;
          color: #00FFA3;
          box-shadow: 0 0 22px rgba(0,255,163,0.28);
          transform: translateY(-2px);
        }
        .footer-link-hackathon {
          background: linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(236,72,153,0.18) 100%);
          color: #E9D5FF;
          border-color: rgba(139,92,246,0.6);
          animation: footer-float 3.2s ease-in-out infinite;
        }
        .footer-link-hackathon:hover {
          background: linear-gradient(135deg, rgba(139,92,246,0.35) 0%, rgba(236,72,153,0.30) 100%);
          border-color: #D8B4FE;
          box-shadow: 0 0 32px rgba(139,92,246,0.55);
          transform: translateY(-3px);
          animation: none;
        }
        .footer-btn-info {
          background: rgba(139,92,246,0.12);
          color: #D8B4FE;
          border-color: rgba(139,92,246,0.4);
        }
        .footer-btn-info:hover {
          background: rgba(139,92,246,0.25);
          border-color: #C084FC;
          box-shadow: 0 0 20px rgba(139,92,246,0.35);
          transform: translateY(-2px);
        }
      `}</style>

      <footer style={{
        position: 'relative',
        zIndex: 2,
        marginTop: '0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, transparent 0%, rgba(2,4,8,0.96) 100%)',
        backdropFilter: 'blur(20px)',
        padding: '32px 24px 28px',
      }}>
        {/* Top divider glow line */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,255,163,0.4), rgba(139,92,246,0.4), transparent)',
        }} />

        <div style={{ maxWidth: 1440, margin: '0 auto' }}>

          {/* Hackathon Banner */}
          <div style={{
            marginBottom: 28,
            padding: '16px 22px',
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(139,92,246,0.10) 0%, rgba(236,72,153,0.08) 50%, rgba(0,255,163,0.06) 100%)',
            border: '1px solid rgba(139,92,246,0.28)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* UNFPA / AU Badge */}
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(139,92,246,0.35), rgba(236,72,153,0.25))',
                border: '1.5px solid rgba(139,92,246,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 0 20px rgba(139,92,246,0.3)',
              }}>
                🌍
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.96rem', fontWeight: 800, letterSpacing: '-0.01em',
                    background: 'linear-gradient(90deg, #D8B4FE, #F9A8D4, #00FFA3)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    SafeTech Africa HackLab '26
                  </span>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px',
                    borderRadius: 9999, background: 'rgba(139,92,246,0.22)',
                    color: '#D8B4FE', border: '1px solid rgba(139,92,246,0.45)',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    UNFPA · AU · SIARP 2.0
                  </span>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px',
                    borderRadius: 9999, background: 'rgba(0,255,163,0.10)',
                    color: '#00FFA3', border: '1px solid rgba(0,255,163,0.3)',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    OPEN · 18 OCT 2026
                  </span>
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 3 }}>
                  <PulseOrb color="#00FFA3" size={7} />
                  Innovating for Safe Spaces, Digital Sovereignty &amp; Rights · USD 5,000–10,000 Seed Grant · Theme 3: Safe Digital Spaces
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="footer-link footer-btn-info"
              >
                <span>📋</span>
                View Brief &amp; Contacts
              </button>

              <a
                href={HACKATHON_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link footer-link-hackathon"
              >
                <span>🏆</span>
                Apply Now
              </a>
            </div>
          </div>

          {/* Bottom Row: Author + Links */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center',
            justifyContent: 'space-between', gap: 18,
          }}>

            {/* Author identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, #00FFA3, #00E5FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', fontWeight: 900, color: '#030509',
                boxShadow: '0 0 16px rgba(0,255,163,0.4)',
              }}>
                H
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
                  Hailemichael Tesfaye
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Builder · NetsaGuard AI · Africa Digital Rights
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* LinkedIn */}
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link footer-link-linkedin"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                </svg>
                LinkedIn
              </a>

              {/* GitHub */}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link footer-link-github"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                GitHub
              </a>

              {/* Copyright */}
              <span style={{
                fontSize: '0.72rem', color: 'var(--text-muted)',
                padding: '0 4px',
              }}>
                © {year} NetsaGuard AI · MIT License
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* SafeTech Africa HackLab Brief Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(3, 5, 10, 0.88)',
          backdropFilter: 'blur(16px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
        onClick={() => setShowModal(false)}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.98), rgba(15, 23, 42, 0.98))',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: 20,
            maxWidth: 720,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(139,92,246,0.25)',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.35), rgba(236,72,153,0.3))',
                  border: '1.5px solid rgba(139,92,246,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem',
                }}>
                  🌍
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.25rem', fontWeight: 800, margin: 0,
                    background: 'linear-gradient(90deg, #D8B4FE, #F9A8D4, #00FFA3)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    SafeTech Africa HackLab 2026
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
                    Innovating for Safe Spaces, Digital Sovereignty &amp; Rights
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#CBD5E1',
                  borderRadius: 10,
                  width: 34,
                  height: 34,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12, marginBottom: 22,
            }}>
              <div style={{
                background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: 12, padding: '12px 14px',
              }}>
                <div style={{ fontSize: '0.68rem', color: '#A78BFA', fontWeight: 700, textTransform: 'uppercase' }}>Timeline</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#F1F5F9', marginTop: 4 }}>30 Sept – 18 Oct '26</div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Closes 23:59 CAT</div>
              </div>

              <div style={{
                background: 'rgba(0,255,163,0.08)', border: '1px solid rgba(0,255,163,0.25)',
                borderRadius: 12, padding: '12px 14px',
              }}>
                <div style={{ fontSize: '0.68rem', color: '#00FFA3', fontWeight: 700, textTransform: 'uppercase' }}>Seed Grant Award</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#F1F5F9', marginTop: 4 }}>$5,000 – $10,000</div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>4 Winners Selected</div>
              </div>

              <div style={{
                background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)',
                borderRadius: 12, padding: '12px 14px',
              }}>
                <div style={{ fontSize: '0.68rem', color: '#F472B6', fontWeight: 700, textTransform: 'uppercase' }}>Target Innovators</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#F1F5F9', marginTop: 4 }}>Ages 18 – 35</div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Young African Innovators</div>
              </div>

              <div style={{
                background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)',
                borderRadius: 12, padding: '12px 14px',
              }}>
                <div style={{ fontSize: '0.68rem', color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase' }}>Final Pitch</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#F1F5F9', marginTop: 4 }}>YouthConnekt Summit</div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>November 2026</div>
              </div>
            </div>

            {/* Background & Strategic Alignment */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              padding: '16px 18px',
              marginBottom: 20,
              fontSize: '0.84rem',
              lineHeight: 1.6,
              color: '#CBD5E1',
            }}>
              <div style={{ fontWeight: 700, color: '#00FFA3', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🛡️</span> NetsaGuard AI Alignment with SafeTech Africa HackLab
              </div>
              <p style={{ margin: 0 }}>
                Co-organized by the <strong>United Nations Population Fund (UNFPA ESARO)</strong> in partnership with the <strong>African Union Commission (AUC)</strong>. NetsaGuard AI targets <strong>Theme 3: Safe Digital Spaces &amp; Digital Sovereignty</strong>, offering decentralized multi-agent defense against censorship, shadowbans, state-directed throttling, and doxxing across 6 major African languages (Amharic, Swahili, Oromo, Hausa, French, English).
              </p>
            </div>

            {/* Focal Contacts */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                Official Focal Contacts
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                {FOCAL_CONTACTS.map((c, i) => (
                  <a
                    key={i}
                    href={`mailto:${c.email}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 14px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
                      e.currentTarget.style.background = 'rgba(139,92,246,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F1F5F9' }}>{c.name}</div>
                      <div style={{ fontSize: '0.74rem', color: '#A78BFA' }}>{c.email}</div>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#64748B' }}>✉️</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  padding: '10px 18px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#CBD5E1',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <a
                href={HACKATHON_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 22px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  color: '#FFF',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 0 20px rgba(139,92,246,0.4)',
                }}
              >
                <span>🚀</span>
                Open Official Google Application Form
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}