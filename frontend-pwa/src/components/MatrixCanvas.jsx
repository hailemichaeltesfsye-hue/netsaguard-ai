import React, { useEffect, useRef } from 'react';

/**
 * Agentic Matrix Canvas Backdrop
 * Renders an immersive, dynamic 2D cyber-matrix featuring African scripts (Ethiopic Ge'ez, Latin),
 * binary streams, and glowing particle conduits.
 * Dynamically shifts neon glow hue and speed based on the active backend agent!
 */
export default function MatrixCanvas({ activeAgent = 'supervisor' }) {
  const canvasRef = useRef(null);

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

    // African Ethiopic glyphs, binary, and cyber glyph tokens
    const GEEZ_GLYPHS = 'ሀለሐመሠረሰሸቀበተቸኀነኘአከኸወዐዘዠየደጀገጠጨጰጸፀፈፐ';
    const LATIN_CYBER = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*+=%<>~';
    const CHAR_SET = (GEEZ_GLYPHS + LATIN_CYBER).split('');

    const fontSize = 15;
    const columns = Math.floor(width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -100));

    // Agent palette colors
    const AGENT_COLORS = {
      supervisor: { primary: '#00FFA3', secondary: 'rgba(0, 255, 163, 0.12)', glow: '#00FFA3' },
      linguistic_specialist: { primary: '#00E5FF', secondary: 'rgba(0, 229, 255, 0.12)', glow: '#00E5FF' },
      disinformation_forensics: { primary: '#FFB800', secondary: 'rgba(255, 184, 0, 0.12)', glow: '#FFB800' },
      compliance_anticensorship: { primary: '#C084FC', secondary: 'rgba(192, 132, 252, 0.14)', glow: '#A855F7' },
      creative_optimization: { primary: '#FB923C', secondary: 'rgba(251, 146, 60, 0.12)', glow: '#F59E0B' },
      critic_judge: { primary: '#FF3366', secondary: 'rgba(255, 51, 102, 0.14)', glow: '#FF3366' },
      pii_sanitizer: { primary: '#10B981', secondary: 'rgba(16, 185, 129, 0.14)', glow: '#059669' },
      hitl_approval_checkpoint: { primary: '#F59E0B', secondary: 'rgba(245, 158, 11, 0.18)', glow: '#D97706' },
      finalizer_manifest: { primary: '#2DD4BF', secondary: 'rgba(45, 212, 191, 0.15)', glow: '#00FFA3' },
      idle: { primary: 'rgba(0, 255, 163, 0.4)', secondary: 'rgba(0, 229, 255, 0.04)', glow: '#00FFA3' }
    };

    let frameCount = 0;

    const render = () => {
      frameCount++;
      const currentTheme = AGENT_COLORS[activeAgent] || AGENT_COLORS.supervisor;

      // Deep obsidian fade overlay
      ctx.fillStyle = 'rgba(7, 10, 15, 0.18)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "Space Grotesk", "Noto Sans Ethiopic", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Leading char has bright neon highlight
        if (Math.random() > 0.92) {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowBlur = 12;
          ctx.shadowColor = currentTheme.glow;
        } else {
          ctx.fillStyle = currentTheme.primary;
          ctx.shadowBlur = 4;
          ctx.shadowColor = currentTheme.primary;
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeAgent]);

  const currentTheme = {
    supervisor: '#00FFA3',
    linguistic_specialist: '#00E5FF',
    disinformation_forensics: '#FFB800',
    compliance_anticensorship: '#C084FC',
    creative_optimization: '#FB923C',
    critic_judge: '#FF3366',
    pii_sanitizer: '#10B981',
    hitl_approval_checkpoint: '#F59E0B',
    finalizer_manifest: '#2DD4BF',
    idle: '#00FFA3'
  }[activeAgent] || '#00FFA3';

  return (
    <>
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
          opacity: 0.42
        }}
      />
      {/* Dynamic Ambient Agent Glow Aura */}
      <div
        style={{
          position: 'fixed',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          height: '60vh',
          background: `radial-gradient(circle, ${currentTheme}22 0%, transparent 70%)`,
          filter: 'blur(80px)',
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'all 0.8s ease'
        }}
      />
    </>
  );
}
