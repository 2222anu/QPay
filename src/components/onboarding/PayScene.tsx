import React from 'react';
import { CheckCircle2, QrCode, Wifi, ArrowUpRight } from 'lucide-react';
import { QtPayLogo } from '../QtPayLogo';

export const PayScene: React.FC = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '320px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1200px',
        overflow: 'visible',
      }}
    >
      {/* Soft Blue Light Trail Background */}
      <svg
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          height: '280px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        viewBox="0 0 320 280"
        fill="none"
      >
        <path
          d="M 40 220 C 70 80, 240 40, 280 140 C 300 200, 220 260, 160 220"
          stroke="url(#blueTrailGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 12"
          style={{
            animation: 'trailPulse 6s linear infinite',
            filter: 'drop-shadow(0 0 10px rgba(46, 131, 255, 0.7))',
          }}
        />
        <defs>
          <linearGradient id="blueTrailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#2e83ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0e274d" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating 3D Glass QR Code Tile (Left) */}
      <div
        style={{
          position: 'absolute',
          top: '22px',
          left: '12px',
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(46, 131, 255, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2e83ff',
          zIndex: 4,
          boxShadow: '0 12px 30px rgba(46, 131, 255, 0.18)',
          animation: 'floatLeft 4s ease-in-out infinite alternate',
        }}
      >
        <QrCode size={28} />
      </div>

      {/* Floating Riyal Coin 1 (Top Right) */}
      <div
        style={{
          position: 'absolute',
          top: '18px',
          right: '24px',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ffffff 0%, #dbeafe 50%, #93c5fd 100%)',
          border: '2px solid rgba(255, 255, 255, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: '11px',
          color: '#1d4ed8',
          zIndex: 4,
          boxShadow: '0 10px 24px rgba(46, 131, 255, 0.22)',
          animation: 'floatCoin 4.5s ease-in-out infinite alternate',
        }}
      >
        SAR
      </div>

      {/* Floating Riyal Coin 2 (Bottom Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: '26px',
          left: '26px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ffffff 0%, #bfdbfe 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: '9px',
          color: '#2563eb',
          zIndex: 4,
          boxShadow: '0 8px 18px rgba(37, 99, 235, 0.18)',
          animation: 'floatCoin 3.8s ease-in-out infinite alternate-reverse',
        }}
      >
        SAR
      </div>

      {/* Main 3D Smartphone Device Body */}
      <div
        style={{
          position: 'relative',
          width: '180px',
          height: '260px',
          borderRadius: '34px',
          backgroundColor: '#0a192f',
          border: '4px solid #1e3a8a',
          padding: '8px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2,
          transform: 'rotateY(-6deg) rotateX(8deg)',
          transformStyle: 'preserve-3d',
          boxShadow: '0 24px 50px rgba(14, 39, 77, 0.28), 0 6px 16px rgba(46, 131, 255, 0.15)',
        }}
      >
        {/* Device Top Speaker Bezel */}
        <div style={{ width: '44px', height: '4px', backgroundColor: '#334155', borderRadius: '4px', margin: '2px auto 8px auto' }} />

        {/* Glossy Screen Canvas */}
        <div
          style={{
            flex: 1,
            borderRadius: '24px',
            background: 'linear-gradient(180deg, #0e274d 0%, #0a192f 100%)',
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Gloss Specular Highlight */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Micro QPay Logo */}
          <div style={{ opacity: 0.9 }}>
            <QtPayLogo variant="horizontal" size={16} themeMode="dark" showTagline={false} />
          </div>

          {/* Payment Success Holographic Emblem */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(46, 131, 255, 0.2)',
                border: '2px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.45)',
                animation: 'pulseGlow 2.5s ease-in-out infinite',
              }}
            >
              <CheckCircle2 size={24} />
            </div>

            <div style={{ fontSize: '11px', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Payment Successful
            </div>

            <div style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.02em' }}>
              SAR 2,500
            </div>
          </div>

          {/* Payee Info Sub-label */}
          <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>
            Tariq Al-Mansoor &bull; Instant Pay
          </div>
        </div>
      </div>

      {/* Floating 3D QPay Payment Card (Front Overlay) */}
      <div
        style={{
          position: 'absolute',
          bottom: '22px',
          right: '16px',
          width: '160px',
          height: '100px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(46, 131, 255, 0.94) 0%, rgba(14, 39, 77, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255, 255, 255, 0.4)',
          padding: '12px 14px',
          boxSizing: 'border-box',
          color: '#ffffff',
          zIndex: 5,
          boxShadow: '0 16px 36px rgba(14, 39, 77, 0.35)',
          transform: 'rotate(-6deg) translateZ(30px)',
          animation: 'floatCard 4s ease-in-out infinite alternate',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Card Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* EMV Chip Graphic */}
          <div
            style={{
              width: '24px',
              height: '18px',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
            }}
          />
          <Wifi size={14} color="#93c5fd" />
        </div>

        {/* Card Number */}
        <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: '#e2e8f0' }}>
          •••• &nbsp;•••• &nbsp;3616
        </div>

        {/* Card Brand */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.08em', color: '#38bdf8' }}>QPAY BLACK</span>
          <ArrowUpRight size={12} color="#ffffff" />
        </div>
      </div>

      <style>{`
        @keyframes floatCard {
          0% { transform: rotate(-6deg) translateY(0px) translateZ(30px); }
          100% { transform: rotate(-4deg) translateY(-8px) translateZ(30px); }
        }
        @keyframes floatLeft {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-7px); }
        }
        @keyframes floatCoin {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-10px) rotate(12deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 16px rgba(56, 189, 248, 0.35); }
          50% { transform: scale(1.06); box-shadow: 0 0 28px rgba(56, 189, 248, 0.65); }
        }
      `}</style>
    </div>
  );
};
