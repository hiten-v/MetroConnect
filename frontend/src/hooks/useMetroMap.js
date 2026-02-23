import { useState, useRef, useCallback, useEffect } from 'react';

export function useMetroMap() {
  const [scale, setScale] = useState(0.7);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
      const el = containerRef.current
      if (!el) return

      const handleWheel = (e) => {
        e.preventDefault()
        setScale(s => Math.min(3, Math.max(0.3, s - e.deltaY * 0.001)))
      }

      el.addEventListener('wheel', handleWheel, { passive: false })
      return () => el.removeEventListener('wheel', handleWheel)
    }, [])

  const onMouseDown = useCallback((e) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTranslate(t => ({ x: t.x + dx, y: t.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => { isDragging.current = false; }, []);

  const zoomIn = useCallback(() => setScale(s => Math.min(3, s + 0.2)), []);
  const zoomOut = useCallback(() => setScale(s => Math.max(0.3, s - 0.2)), []);
  const reset = useCallback(() => { setScale(0.7); setTranslate({ x: 0, y: 0 }); }, []);

  return { containerRef, scale, translate, onMouseDown, onMouseMove, onMouseUp, zoomIn, zoomOut, reset };
}