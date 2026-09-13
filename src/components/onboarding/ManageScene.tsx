import React from 'react';
import { Landmark, ArrowRightLeft, Zap, Wifi, Wallet } from 'lucide-react';

export const ManageScene: React.FC = () => {
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
      {/* Dynamic Connecting Light Streams (SVG curves flowing toward center) */}
      <svg
        style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          height: '300px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        viewBox="0 0 320 300"
        fill="none"
      >
        {/* Left curve flowing into center */}
        <path
          d="M 30 70 C 80 120, 100 160, 160 170"
          stroke="url(#streamGrad1)"
          strokeWidth="2.5"
          strokeDasharray="4 8"
          style={{ animation: 'flowDash 4s linear infinite', filter: 'drop-shadow(0 0 8px rgba(46, 131, 255, 0.6))' }}
        />
        {/* Right curve flowing into center */}
        <path
          d="M 290 80 C 240 120, 220 160, 160 170"
          stroke="url(#streamGrad2)"
          strokeWidth="2.5"
          strokeDasharray="4 8"
          style={{ animation: 'flowDash 4s linear infinite reverse', filter: 'drop-shadow(0 0 8px rgba(46, 131, 255, 0.6))' }}
        />
        {/* Bottom curve */}
        <path
          d="M 80 270 C 120 220, 140 190, 160 170"
          stroke="url(#streamGrad1)"
          strokeWidth="2"
          strokeDasharray="4 6"
          style={{ animation: 'flowDash 3.5s linear infinite' }}
        />

        <defs>
          <linearGradient id="streamGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2e83ff" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="streamGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2e83ff" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top 3D Stacked Bank Cards (Fanning out) */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          width: '260px',
          height: '140px',
          zIndex: 3,
        }}
      >
        {/* Card 3: Deep Navy Peeking in Background */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '30px',
            right: '30px',
            height: '75px',
            borderRadius: '16px',
            backgroundColor: '#0a192f',
            border: '1px solid #1e3a8a',
            padding: '8px 14px',
            color: '#94a3b8',
            fontSize: '10px',
            fontWeight: 800,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            transform: 'scale(0.92)',
            opacity: 0.75,
            boxShadow: '0 8px 20px rgba(10, 25, 47, 0.2)',
          }}
        >
          <span>SBI GLOBAL &bull; •••• 5590</span>
          <span>₹12,450</span>
        </div>

        {/* Card 2: Electric Blue Card Layered */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '15px',
            right: '15px',
            height: '80px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #0e274d 100%)',
            border: '1.5px solid #38bdf8',
            padding: '10px 16px',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            transform: 'scale(0.96)',
            zIndex: 2,
            boxShadow: '0 12px 28px rgba(29, 78, 216, 0.25)',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 800 }}>ICICI SAPPHIRE &bull; •••• 3616</span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>₹18,450</span>
        </div>

        {/* Card 1: Primary HDFC Platinum Card (Foreground) */}
        <div
          style={{
            position: 'absolute',
            top: '32px',
            left: '0',
            right: '0',
            height: '92px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #0e274d 0%, #153e75 50%, #2e83ff 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.5)',
            padding: '12px 18px',
            color: '#ffffff',
            zIndex: 3,
            boxShadow: '0 16px 36px rgba(14, 39, 77, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: 'floatTopCard 4s ease-in-out infinite alternate',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Landmark size={14} color="#38bdf8" />
              <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.04em' }}>HDFC PLATINUM</span>
            </div>
            <Wifi size={13} color="#93c5fd" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '9px', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Primary Account
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 800, letterSpacing: '2px', color: '#ffffff' }}>
                •••• 8821
              </div>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#ffffff' }}>
              ₹45,280
            </div>
          </div>
        </div>
      </div>

      {/* Central 3D QPay Wallet Core (Hub of all financial streams) */}
      <div
        style={{
          position: 'absolute',
          bottom: '22px',
          width: '240px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(46, 131, 255, 0.35)',
          padding: '14px 18px',
          zIndex: 4,
          boxShadow: '0 20px 45px rgba(46, 131, 255, 0.22), 0 0 30px rgba(56, 189, 248, 0.15)',
          textAlign: 'center',
          animation: 'pulseHub 3.5s ease-in-out infinite',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#eef5ff',
              color: '#2e83ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Wallet size={16} />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0e274d', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Unified QPay Wallet
          </span>
        </div>

        <div style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Total Financial Balance
        </div>
        <div className="tabular-nums" style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: '2px 0 6px 0', letterSpacing: '0.01em' }}>
          ₹ 63,730.00
        </div>

        {/* Floating Streams Indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, backgroundColor: '#eef5ff', color: '#2e83ff', padding: '3px 8px', borderRadius: '8px', border: '1px solid #d6e6ff' }}>
            3 Banks Connected
          </span>
          <span style={{ fontSize: '9px', fontWeight: 800, backgroundColor: 'rgba(46, 131, 255, 0.1)', color: '#1d4ed8', padding: '3px 8px', borderRadius: '8px', border: '1px solid rgba(46, 131, 255, 0.25)' }}>
            Auto-Sync
          </span>
        </div>
      </div>

      {/* Floating Action Capsules Orbiting Inward */}
      <div
        style={{
          position: 'absolute',
          top: '150px',
          left: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid #d6e6ff',
          borderRadius: '14px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          color: '#2e83ff',
          fontSize: '10px',
          fontWeight: 800,
          zIndex: 5,
          boxShadow: '0 8px 20px rgba(46, 131, 255, 0.15)',
          animation: 'floatCapsuleLeft 3.5s ease-in-out infinite alternate',
        }}
      >
        <ArrowRightLeft size={12} />
        <span>Send &bull; Request</span>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '145px',
          right: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid #d6e6ff',
          borderRadius: '14px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          color: '#2e83ff',
          fontSize: '10px',
          fontWeight: 800,
          zIndex: 5,
          boxShadow: '0 8px 20px rgba(46, 131, 255, 0.15)',
          animation: 'floatCapsuleRight 3.8s ease-in-out infinite alternate',
        }}
      >
        <Zap size={12} />
        <span>Bills &bull; Recharge</span>
      </div>

      <style>{`
        @keyframes floatTopCard {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-6px); }
        }
        @keyframes pulseHub {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes floatCapsuleLeft {
          0% { transform: translateY(0px) rotate(-2deg); }
          100% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes floatCapsuleRight {
          0% { transform: translateY(0px) rotate(2deg); }
          100% { transform: translateY(-7px) rotate(-1deg); }
        }
        @keyframes flowDash {
          to { stroke-dashoffset: -48; }
        }
      `}</style>
    </div>
  );
};
