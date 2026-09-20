import { useEffect, useState, useRef } from 'react';

export function useMousePosition() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normX: 0, normY: 0 });
  const targetPosRef = useRef({ x: 0, y: 0, normX: 0, normY: 0 });
  const currentPosRef = useRef({ x: 0, y: 0, normX: 0, normY: 0 });

  useEffect(() => {
    // Only track on non-touch devices
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth) * 2 - 1; // -1 to 1
      const normY = (e.clientY / innerHeight) * 2 - 1; // -1 to 1

      targetPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        normX,
        normY
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animFrame;
    const updateLoop = () => {
      // Gentle smoothing factor
      const ease = 0.08;
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * ease;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * ease;
      currentPosRef.current.normX += (targetPosRef.current.normX - currentPosRef.current.normX) * ease;
      currentPosRef.current.normY += (targetPosRef.current.normY - currentPosRef.current.normY) * ease;

      setMousePos({
        x: Math.round(currentPosRef.current.x),
        y: Math.round(currentPosRef.current.y),
        normX: currentPosRef.current.normX,
        normY: currentPosRef.current.normY,
      });

      animFrame = requestAnimationFrame(updateLoop);
    };

    animFrame = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return mousePos;
}
