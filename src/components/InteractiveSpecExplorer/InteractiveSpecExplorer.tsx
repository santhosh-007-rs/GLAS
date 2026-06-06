import { useState } from 'react';
import { Sliders, Shield, Zap, Activity } from 'lucide-react';

export default function InteractiveSpecExplorer() {
  const [refraction, setRefraction] = useState(25); // blur size: 10px to 60px
  const [glow, setGlow] = useState(1.0); // opacity / glow scale: 0.2 to 2.0
  const [warp, setWarp] = useState(1.0); // scale: 0.5 to 2.0
  const [mode, setMode] = useState<'waveguide' | 'colloid' | 'resonant'>('waveguide');

  const getTelemetryLog = () => {
    switch (mode) {
      case 'waveguide':
        return [
          `[SYS] CHROMATIC DISPERSION: ${(refraction * 0.12).toFixed(2)} nm`,
          `[SYS] PEAK LUMINANCE: ${(glow * 1000).toFixed(0)} NITS`,
          `[SYS] TENSION INDEX: ${(warp * 1.5).toFixed(2)} GPa`,
          `[SYS] STATUS: WAVEGUIDE BEAM ALIGNED`
        ];
      case 'colloid':
        return [
          `[SYS] SUSPENSION VISCOSITY: ${(refraction * 0.4).toFixed(1)} cSt`,
          `[SYS] MAGNETIC FLUX: ${(glow * 1.4).toFixed(2)} TESLA`,
          `[SYS] BLOB DIAMETER: ${(warp * 3.2).toFixed(2)} mm`,
          `[SYS] STATUS: NEODYMIUM CORE STABILIZED`
        ];
      case 'resonant':
        return [
          `[SYS] RESONANCE CUTOFF: ${(refraction * 80).toFixed(0)} Hz`,
          `[SYS] DRIVER AMPLITUDE: ${(glow * 12).toFixed(1)} mm`,
          `[SYS] ACOUSTIC DAMPING: ${(warp * 0.85).toFixed(2)} Q`,
          `[SYS] STATUS: OMNIDIRECTIONAL DRIVERS BALANCED`
        ];
    }
  };

  const activeColor = mode === 'waveguide' ? 'var(--accent-cyan)' : mode === 'colloid' ? 'var(--accent-emerald)' : 'var(--accent-purple)';

  return (
    <section className="products-sec" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', background: 'transparent' }}>
      <div className="container">
        <div className="sec-header">
          <span className="hero-subtitle" style={{ color: activeColor }}>CYBERNETIC LABS</span>
          <h2 className="sec-title">DYNAMIC TELEMETRY TUNER</h2>
          <p className="sec-desc">Interact with refractive, acoustic, and electromagnetic variables in real-time.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '3rem',
          alignItems: 'center',
          marginTop: '3rem'
        }}>
          {/* Controls & Telemetry */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '2.5rem',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            {/* Mode Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
              <button
                onClick={() => setMode('waveguide')}
                style={{
                  background: mode === 'waveguide' ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
                  border: `1px solid ${mode === 'waveguide' ? 'var(--accent-cyan)' : 'transparent'}`,
                  color: mode === 'waveguide' ? 'white' : 'var(--text-muted)',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Waveguide Lenses
              </button>
              <button
                onClick={() => setMode('colloid')}
                style={{
                  background: mode === 'colloid' ? 'rgba(0, 255, 170, 0.1)' : 'transparent',
                  border: `1px solid ${mode === 'colloid' ? 'var(--accent-emerald)' : 'transparent'}`,
                  color: mode === 'colloid' ? 'white' : 'var(--text-muted)',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Colloidal Fluid
              </button>
              <button
                onClick={() => setMode('resonant')}
                style={{
                  background: mode === 'resonant' ? 'rgba(179, 114, 255, 0.1)' : 'transparent',
                  border: `1px solid ${mode === 'resonant' ? 'var(--accent-purple)' : 'transparent'}`,
                  color: mode === 'resonant' ? 'white' : 'var(--text-muted)',
                  padding: '0.5rem 1.2rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Resonant Audio
              </button>
            </div>

            {/* Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                    <Sliders size={14} style={{ color: activeColor }} /> Refractive Diffusion
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', color: activeColor }}>{refraction}px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={refraction}
                  onChange={(e) => setRefraction(Number(e.target.value))}
                  style={{
                    accentColor: activeColor,
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    height: '6px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                    <Zap size={14} style={{ color: activeColor }} /> Flux Luminance
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', color: activeColor }}>{glow.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.1"
                  value={glow}
                  onChange={(e) => setGlow(Number(e.target.value))}
                  style={{
                    accentColor: activeColor,
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    height: '6px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                    <Shield size={14} style={{ color: activeColor }} /> Structural Warp
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', color: activeColor }}>{warp.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={warp}
                  onChange={(e) => setWarp(Number(e.target.value))}
                  style={{
                    accentColor: activeColor,
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    height: '6px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>

            {/* Telemetry Console Logs */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '12px',
              padding: '1.25rem',
              fontFamily: 'var(--mono)',
              fontSize: '0.75rem',
              color: activeColor,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem' }}>
                <Activity size={12} className="animate-pulse" />
                <span style={{ fontWeight: 'bold', color: 'white' }}>DIAGNOSTIC DATA CONSOLE</span>
              </div>
              {getTelemetryLog().map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>

          {/* Interactive Specimen Preview */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            height: '400px'
          }}>
            {/* Visualizer Container */}
            <div style={{
              position: 'relative',
              width: '240px',
              height: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Glowing Background Radial */}
              <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                background: `radial-gradient(circle, ${activeColor}20 0%, transparent 70%)`,
                transform: `scale(${warp * 1.1})`,
                opacity: glow * 0.8,
                transition: 'all 0.1s ease',
                filter: 'blur(30px)',
                pointerEvents: 'none'
              }}></div>

              {/* The Glass Specimen */}
              <div style={{
                position: 'relative',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid rgba(255, 255, 255, ${0.1 + glow * 0.15})`,
                backdropFilter: `blur(${refraction}px)`,
                WebkitBackdropFilter: `blur(${refraction}px)`,
                transform: `scale(${warp})`,
                transition: 'all 0.1s ease',
                boxShadow: `
                  inset 0 10px 30px rgba(255,255,255,0.1),
                  0 20px 50px rgba(0,0,0,0.5),
                  0 0 ${refraction * 0.8}px rgba(${mode === 'waveguide' ? '0, 243, 255' : mode === 'colloid' ? '0, 255, 170' : '179, 114, 255'}, ${glow * 0.25})
                `,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Refractive Liquid Sphere Internals */}
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${activeColor}70, transparent 80%)`,
                  filter: `blur(${refraction * 0.3}px)`,
                  transform: `scale(${1.2 - warp * 0.2}) rotate(${refraction * 2}deg)`,
                  transition: 'all 0.2s ease',
                  opacity: 0.6 + glow * 0.2
                }}></div>
              </div>
            </div>
            
            {/* Holographic Sizing Tag */}
            <div style={{
              marginTop: '2rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '30px',
              padding: '0.4rem 1.2rem',
              fontFamily: 'var(--mono)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              <span>MODEL:</span>
              <span style={{ color: 'white', fontWeight: 'bold' }}>GLAS-{mode.toUpperCase()}-v3.8</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
