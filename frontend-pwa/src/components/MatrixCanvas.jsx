import React, { useEffect, useRef } from 'react';

/**
 * NetsaGuard AI: Agentic Matrix Canvas Backdrop
 * Features:
 *  - Cinematic dark Ethiopic/Latin cyber-rain (falling glyph columns)
 *  - Realistic forked lightning bolts with branching + flash overlay
 *  - Agent-reactive glow colors that shift based on active node
 */

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export default function MatrixCanvas({ activeAgent = 'idle' }) {
  const canvasRef = useRef(null);
  const activeAgentRef = useRef(activeAgent);

  useEffect(() => {
    activeAgentRef.current = activeAgent;
  }, [activeAgent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Ethiopic Ge'ez + cyber chars
    const GEEZ = 'ሀለሐመሠረሰሸቀበተቸኀነኘአከኸወዐዘዠየደጀገጠጨጰጸፀፈፐ';
    const CYBER = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#∑∆∇⟨⟩≡≢∞Ø';
    const CHARS = (GEEZ + CYBER).split('');

    const THEME_COLORS = {
      supervisor:                '#00FFA3',
      linguistic_specialist:     '#00E5FF',
      disinformation_forensics:  '#FFB800',
      compliance_anticensorship: '#C084FC',
      creative_optimization:     '#FB923C',
      critic_judge:              '#FF3366',
      pii_sanitizer:             '#10B981',
      hitl_approval_checkpoint:  '#F59E0B',
      finalizer_manifest:        '#00FFA3',
      idle:                      '#00FFA3',
    };

    // ── Rain columns ────────────────────────────────────────────────────────
    const FONT_SIZE = 15;
    const columns = Math.floor(width / FONT_SIZE);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -120));

    // ── Lightning state ─────────────────────────────────────────────────────
    let lightningBolts = [];
    let flashAlpha = 0;
    let nextLightningIn = 220 + Math.floor(Math.random() * 200);

    function buildLightning(x1, y1, x2, y2, depth, segments) {
      if (depth === 0 || Math.abs(y2 - y1) < 6) {
        segments.push({ x1, y1, x2, y2, isBranch: false });
        return;
      }
      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * (90 / depth);
      const midY = (y1 + y2) / 2;
      buildLightning(x1, y1, midX, midY, depth - 1, segments);
      buildLightning(midX, midY, x2, y2, depth - 1, segments);
      if (depth > 1 && Math.random() < 0.38) {
        const bx = midX + (Math.random() - 0.5) * 220;
        const by = midY + Math.random() * (height * 0.28);
        const branchSegs = [];
        buildLightning(midX, midY, bx, by, depth - 2, branchSegs);
        branchSegs.forEach(s => { s.isBranch = true; segments.push(s); });
      }
    }

    function spawnLightning(color) {
      const startX = 60 + Math.random() * (width - 120);
      const endX = startX + (Math.random() - 0.5) * width * 0.55;
      const segs = [];
      buildLightning(startX, 0, endX, height * (0.35 + Math.random() * 0.42), 7, segs);
      const life = 18 + Math.floor(Math.random() * 14);
      lightningBolts.push({ segments: segs, life, maxLife: life, color });
      flashAlpha = 0.2 + Math.random() * 0.18;
    }

    // ── Render loop ─────────────────────────────────────────────────────────
    const render = () => {
      const accentColor = THEME_COLORS[activeAgentRef.current] || '#00FFA3';

      // Dark obsidian fade
      ctx.fillStyle = 'rgba(3, 5, 10, 0.13)';
      ctx.fillRect(0, 0, width, height);

      // Rain glyphs
      ctx.font = `${FONT_SIZE}px "Noto Sans Ethiopic", "JetBrains Mono", monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;
        if (y > 0 && y < height) {
          if (Math.random() > 0.93) {
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowBlur = 8;
            ctx.shadowColor = accentColor;
          } else {
            ctx.fillStyle = `rgba(${hexToRgb(accentColor)}, ${0.05 + Math.random() * 0.11})`;
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
          }
          ctx.fillText(ch, x, y);
        }
        if (drops[i] * FONT_SIZE > height && Math.random() > 0.978) {
          drops[i] = Math.floor(Math.random() * -60);
        }
        drops[i] += 0.55 + Math.random() * 0.45;
      }

      // Lightning countdown
      nextLightningIn--;
      if (nextLightningIn <= 0) {
        spawnLightning(accentColor);
        nextLightningIn = 200 + Math.floor(Math.random() * 240);
      }

      // Draw lightning
      ctx.lineCap = 'round';
      for (let b = lightningBolts.length - 1; b >= 0; b--) {
        const bolt = lightningBolts[b];
        const progress = bolt.life / bolt.maxLife;
        const alpha = Math.pow(progress, 0.5);
        for (const seg of bolt.segments) {
          const isB = seg.isBranch;
          // Glow halo
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.strokeStyle = bolt.color + Math.round(alpha * (isB ? 40 : 70)).toString(16).padStart(2, '0');
          ctx.lineWidth = isB ? 6 : 12;
          ctx.shadowBlur = 28;
          ctx.shadowColor = bolt.color;
          ctx.stroke();
          // Core white bolt
          ctx.beginPath();
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
          ctx.strokeStyle = `rgba(255,255,255,${alpha * (isB ? 0.6 : 0.95)})`;
          ctx.lineWidth = isB ? 1 : 2.2;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#FFFFFF';
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
        bolt.life--;
        if (bolt.life <= 0) lightningBolts.splice(b, 1);
      }

      // Screen flash
      if (flashAlpha > 0.004) {
        ctx.fillStyle = `rgba(255,255,255,${flashAlpha})`;
        ctx.fillRect(0, 0, width, height);
        flashAlpha *= 0.82;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // mount once; agent color tracked via ref

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: '#030509'
      }}
    />
  );
}
