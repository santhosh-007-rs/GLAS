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
        <div className="scroll-sticky-viewport">
          <canvas ref={canvasRef} className="scroll-canvas" />
          <div className="scroll-overlay-glow"></div>
          
          <div className={`scroll-text-overlay ${scrollProgress > 0.05 && scrollProgress < 0.32 ? 'active' : ''}`}>
            <span className="scroll-text-subtitle" style={{ color: themeAccent }}>01 / REFRACTIVE SYSTEM</span>
            <h2 className="scroll-text-title">CRYSTALLINE DESIGN</h2>
            <p className="scroll-text-desc">High-precision micro-waveguides that bend photons to build volumetric cybernetic hardware interfaces.</p>
          </div>

          <div className={`scroll-text-overlay ${scrollProgress >= 0.38 && scrollProgress < 0.65 ? 'active' : ''}`}>
            <span className="scroll-text-subtitle" style={{ color: themeAccent }}>02 / RESONANCE SPECTRUM</span>
            <h2 className="scroll-text-title">SOUNDWAVE CALIBRATION</h2>
            <p className="scroll-text-desc">Levitating acoustic capsules matching sonic frequencies with integrated neon light guides.</p>
          </div>

          <div className={`scroll-text-overlay ${scrollProgress >= 0.70 && scrollProgress < 0.95 ? 'active' : ''}`}>
            <span className="scroll-text-subtitle" style={{ color: themeAccent }}>03 / KINETIC VISIONS</span>
            <h2 className="scroll-text-title">FERROFLUID GEOMETRY</h2>
            <p className="scroll-text-desc">Fluid dynamic magnetic cores shifting forms in perfect synchronization with your screen movement.</p>
          </div>
          
          <div className="scroll-progress-dots">
            <div className={`scroll-dot ${scrollProgress > 0.05 && scrollProgress < 0.32 ? 'active' : ''}`} style={{ '--dot-color': themeAccent } as React.CSSProperties}></div>
            <div className={`scroll-dot ${scrollProgress >= 0.38 && scrollProgress < 0.65 ? 'active' : ''}`} style={{ '--dot-color': themeAccent } as React.CSSProperties}></div>
            <div className={`scroll-dot ${scrollProgress >= 0.70 && scrollProgress < 0.95 ? 'active' : ''}`} style={{ '--dot-color': themeAccent } as React.CSSProperties}></div>
          </div>
          
          <div className="scroll-guide-prompt" style={{ opacity: scrollProgress < 0.08 ? 1 : 0 }}>
            <span style={{ color: themeAccent }}>SCROLL TO INITIATE REVELATION</span>
            <div className="scroll-guide-arrow" style={{ borderBottomColor: themeAccent, borderRightColor: themeAccent }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
