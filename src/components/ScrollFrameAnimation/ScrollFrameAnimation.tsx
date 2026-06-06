import { useEffect, useRef, useState } from 'react';
import './ScrollFrameAnimation.css';

interface ScrollFrameAnimationProps {
  themeAccent: string;
}

export default function ScrollFrameAnimation({ themeAccent }: ScrollFrameAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  
  const totalFrames = 200;
  
  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];
    
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/assets/Frames/ezgif-frame-${frameNum}.jpg`;
      img.onload = () => {
        loadedCount++;
        setLoadingProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        // Fallback in case of individual loading errors to prevent freezing
        loadedCount++;
        setLoadingProgress(Math.round((loadedCount / totalFrames) * 100));
        if (loadedCount === totalFrames) {
          setIsLoading(false);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // Handle scroll and update canvas / text overlays
  useEffect(() => {
    if (isLoading || images.length === 0) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the section has been scrolled
      const totalScrollable = containerHeight - windowHeight;
      if (totalScrollable <= 0) return;
      
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      
      setScrollProgress(progress);
      
      // Draw frame
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const frameIndex = Math.max(0, Math.min(totalFrames - 1, Math.floor(progress * (totalFrames - 1))));
          const img = images[frameIndex];
          if (img && img.complete) {
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;
            
            const imgRatio = imgWidth / imgHeight;
            const canvasRatio = canvasWidth / canvasHeight;
            
            let drawWidth = canvasWidth;
            let drawHeight = canvasHeight;
            let offsetX = 0;
            let offsetY = 0;
            
            if (canvasRatio > imgRatio) {
              drawHeight = canvasWidth / imgRatio;
              offsetY = (canvasHeight - drawHeight) / 2;
            } else {
              drawWidth = canvasHeight * imgRatio;
              offsetX = (canvasWidth - drawWidth) / 2;
            }
            
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          }
        }
      }
    };
    
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        handleScroll();
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isLoading, images]);

  const getViewportOpacity = () => {
    if (scrollProgress < 0.15) {
      return scrollProgress / 0.15;
    }
    if (scrollProgress > 0.85) {
      return Math.max(0, (1 - scrollProgress) / 0.15);
    }
    return 1;
  };

  return (
    <div className="scroll-animation-container" ref={containerRef}>
      {isLoading ? (
        <div className="scroll-loader-container">
          <div className="scroll-loader-glow" style={{ background: `radial-gradient(circle, ${themeAccent}25 0%, transparent 65%)` }}></div>
          <div className="scroll-loader-box">
            <div className="scroll-loader-spinner" style={{ borderLeftColor: themeAccent }}></div>
            <div className="scroll-loader-text">PRELOADING INTERACTIVE VISION SYSTEM</div>
            <div className="scroll-loader-progress-bar">
              <div className="scroll-loader-progress-fill" style={{ width: `${loadingProgress}%`, background: themeAccent }}></div>
            </div>
            <div className="scroll-loader-percentage">{loadingProgress}%</div>
          </div>
        </div>
      ) : (
        <div className="scroll-sticky-viewport" style={{ opacity: getViewportOpacity() }}>
          <canvas ref={canvasRef} className="scroll-canvas" />
          <div className="scroll-overlay-glow"></div>
          
          <div className="scroll-guide-prompt" style={{ opacity: scrollProgress < 0.08 ? 1 : 0 }}>
            <span style={{ color: themeAccent }}>SCROLL TO INITIATE REVELATION</span>
            <div className="scroll-guide-arrow" style={{ borderBottomColor: themeAccent, borderRightColor: themeAccent }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
