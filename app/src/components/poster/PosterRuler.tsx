import React, { useRef, useEffect, useState } from 'react';

interface PosterRulerProps {
  orientation: 'horizontal' | 'vertical';
  /** Poster dimension in px (1px = 1mm in this system) */
  length: number;
  /** Current canvas zoom scale */
  scale: number;
}

const RULER_SIZE = 20; // px — thickness of the ruler strip

/** Adaptive tick intervals based on zoom so labels never overlap */
function getIntervals(scale: number): { major: number; minor: number } {
  if (scale < 0.15) return { major: 200, minor: 50 };
  if (scale < 0.3)  return { major: 100, minor: 20 };
  if (scale < 0.55) return { major: 50,  minor: 10 };
  if (scale < 1.1)  return { major: 20,  minor: 5  };
  return               { major: 10,  minor: 2  };
}

const PosterRuler: React.FC<PosterRulerProps> = ({ orientation, length, scale }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dpr, setDpr] = useState(window.devicePixelRatio || 1);

  useEffect(() => {
    const update = () => setDpr(window.devicePixelRatio || 1);
    const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const scaledLength = Math.ceil(length * scale);
  const { major, minor } = getIntervals(scale);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isH = orientation === 'horizontal';
    const W = isH ? scaledLength : RULER_SIZE;
    const H = isH ? RULER_SIZE   : scaledLength;

    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, W, H);

    // Border line
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    if (isH) {
      ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(W, H); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(W, 0); ctx.lineTo(W, H); ctx.stroke();
    }

    ctx.strokeStyle = '#9ca3af';
    ctx.fillStyle   = '#6b7280';
    ctx.font        = `7px monospace`;
    ctx.textBaseline = 'top';

    for (let mm = 0; mm <= length; mm += minor) {
      const pos     = mm * scale;
      const isMajor = mm % major === 0;
      const tickLen = isMajor ? 8 : 4;

      ctx.lineWidth = 0.75;
      ctx.beginPath();
      if (isH) {
        ctx.moveTo(pos, H);
        ctx.lineTo(pos, H - tickLen);
      } else {
        ctx.moveTo(W, pos);
        ctx.lineTo(W - tickLen, pos);
      }
      ctx.stroke();

      if (isMajor && mm > 0) {
        const label = String(mm);
        if (isH) {
          ctx.fillText(label, pos + 2, 2);
        } else {
          ctx.save();
          ctx.translate(RULER_SIZE / 2 + 1, pos - 2);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(label, 0, 0);
          ctx.restore();
        }
      }
    }
  }, [orientation, length, scale, scaledLength, major, minor, dpr]);

  if (orientation === 'horizontal') {
    return (
      <canvas
        ref={canvasRef}
        className="block flex-shrink-0 print:hidden"
        style={{ width: scaledLength, height: RULER_SIZE, cursor: 'default' }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="block flex-shrink-0 print:hidden"
      style={{ width: RULER_SIZE, height: scaledLength, cursor: 'default' }}
    />
  );
};

export { RULER_SIZE };
export default PosterRuler;
