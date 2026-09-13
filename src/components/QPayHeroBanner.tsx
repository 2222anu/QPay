import React from 'react';
import { useApp } from '../state/AppContext';
import heroPromoImg from '../assets/qpay-hero-promo.png';

export const QPayHeroBanner: React.FC = () => {
  const { navigateTo } = useApp();

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo('PAY_ANYONE');
  };

  return (
    <div
      className="qpay-hero-banner-container"
      onClick={() => navigateTo('PAY_ANYONE')}
      role="banner"
      aria-label="QPay Promotional Banner - Payments, made simple. Pay with QPay"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigateTo('PAY_ANYONE');
        }
      }}
    >
      <style>{`
        .qpay-hero-banner-container {
          position: relative;
          margin: 14px auto 0 auto;
          border-radius: 10px;
          background: #ffffff;
          border: 1px solid #d6e6ff;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 1024 / 394;
          min-height: 135px;
          max-height: 200px;
          width: calc(100% - 2 * clamp(12px, 3.5vw, 20px));
          animation: bannerEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          contain: paint layout;
          transform: translateZ(0);
          user-select: none;
        }

        /* 1. Initial Banner Slide/Fade Entrance */
        @keyframes bannerEntrance {
          0% {
            opacity: 0;
            transform: translate3d(0, -6px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        /* 2. Base Promotional Artwork with Ambient Breath */
        .qpay-hero-base-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          pointer-events: none;
          transform-origin: 65% 50%;
          animation: ambientBaseBreath 6s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes ambientBaseBreath {
          0%, 100% {
            transform: scale(1) translate3d(0, 0, 0);
          }
          50% {
            transform: scale(1.012) translate3d(-1.5px, -1.5px, 0);
          }
        }

        /* 3. Floating QPay Card Specular Overlay & Float */
        .qpay-card-float-layer {
          position: absolute;
          left: 45%;
          top: 22%;
          width: 21%;
          height: 44%;
          pointer-events: none;
          animation: cardFloatLoop 6s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes cardFloatLoop {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(-2.5px, -4.5px, 0) rotate(-0.8deg);
          }
        }

        .qpay-card-glow-specular {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.28) 0%,
            rgba(56, 189, 248, 0.15) 45%,
            transparent 75%
          );
          mix-blend-mode: overlay;
          animation: cardShimmer 6s ease-in-out infinite;
        }

        @keyframes cardShimmer {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.85;
          }
        }

        /* 4. Smartphone Parallax & Screen Check Pulse */
        .qpay-phone-float-layer {
          position: absolute;
          left: 61.5%;
          top: 5.5%;
          width: 21.5%;
          height: 84%;
          pointer-events: none;
          animation: phoneFloatLoop 6s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes phoneFloatLoop {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -2.5px, 0);
          }
        }

        /* Screen verification checkmark subtle pulse */
        .qpay-phone-check-pulse {
          position: absolute;
          left: 38%;
          top: 38%;
          width: 24%;
          height: 16%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(46, 131, 255, 0.35) 0%, transparent 70%);
          animation: checkPulse 3s ease-in-out infinite;
        }

        @keyframes checkPulse {
          0%, 100% {
            transform: scale(0.9);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.75;
          }
        }

        /* 5. Glowing Orbital Light Energy Ring */
        .qpay-orbital-ring-container {
          position: absolute;
          left: 42%;
          top: 25%;
          width: 50%;
          height: 54%;
          pointer-events: none;
          transform-origin: 50% 50%;
          animation: orbitalRingMotion 6s ease-in-out infinite;
          will-change: transform, opacity;
        }

        @keyframes orbitalRingMotion {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.75;
          }
          50% {
            transform: scale(1.035) rotate(1.2deg);
            opacity: 1;
          }
        }

        .qpay-orbital-svg-ring {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        /* 6. Floating Rupee Coins Specular Motion */
        .qpay-coin-top {
          position: absolute;
          right: 9.5%;
          top: 12%;
          width: 9%;
          height: 22%;
          pointer-events: none;
          animation: coinTopFloat 6s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes coinTopFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(1.5px, -5px, 0) rotate(2.5deg);
          }
        }

        .qpay-coin-bottom {
          position: absolute;
          right: 8.5%;
          top: 57%;
          width: 8.5%;
          height: 20%;
          pointer-events: none;
          animation: coinBottomFloat 6s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes coinBottomFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(-1.5px, 4px, 0) rotate(-2deg);
          }
        }

        .qpay-coin-sheen {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.45) 0%, rgba(56, 189, 248, 0.2) 50%, transparent 80%);
          animation: coinGleam 6s ease-in-out infinite;
        }

        @keyframes coinGleam {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

        /* 7. Ambient Floating Light Particles */
        .qpay-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          background: #ffffff;
          will-change: transform, opacity;
        }

        .qpay-p1 {
          left: 36%;
          top: 32%;
          width: 3.5px;
          height: 3.5px;
          background: #e0f2fe;
          filter: drop-shadow(0 0 3px #38bdf8);
          animation: particleDrift1 6s ease-in-out infinite;
        }

        .qpay-p2 {
          left: 44%;
          top: 15%;
          width: 4px;
          height: 4px;
          background: #bae6fd;
          filter: drop-shadow(0 0 4px #60a5fa);
          animation: particleDrift2 6s ease-in-out infinite;
        }

        .qpay-p3 {
          right: 14%;
          top: 42%;
          width: 3px;
          height: 3px;
          background: #ffffff;
          filter: drop-shadow(0 0 3px #93c5fd);
          animation: particleDrift1 6s ease-in-out infinite 1.2s;
        }

        .qpay-p4 {
          right: 28%;
          top: 18%;
          width: 2.5px;
          height: 2.5px;
          background: #e0f2fe;
          filter: drop-shadow(0 0 2px #38bdf8);
          animation: particleDrift3 6s ease-in-out infinite 0.5s;
        }

        .qpay-p5 {
          left: 56%;
          top: 72%;
          width: 3px;
          height: 3px;
          background: #ffffff;
          filter: drop-shadow(0 0 3px #60a5fa);
          animation: particleDrift2 6s ease-in-out infinite 2s;
        }

        @keyframes particleDrift1 {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.35;
          }
          50% {
            transform: translate3d(-3px, -7px, 0);
            opacity: 0.95;
          }
        }

        @keyframes particleDrift2 {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.4;
          }
          50% {
            transform: translate3d(3px, -8px, 0);
            opacity: 1;
          }
        }

        @keyframes particleDrift3 {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.25;
          }
          50% {
            transform: translate3d(-2px, -5px, 0);
            opacity: 0.85;
          }
        }

        /* 8. Diagonal Luxury Light Sweep Across Banner */
        .qpay-light-sweep-layer {
          position: absolute;
          top: -20%;
          left: -40%;
          width: 35%;
          height: 140%;
          background: linear-gradient(
            105deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 35%,
            rgba(255, 255, 255, 0.45) 50%,
            rgba(186, 230, 253, 0.25) 55%,
            transparent 70%
          );
          transform: skewX(-20deg) translate3d(-200%, 0, 0);
          pointer-events: none;
          animation: sweepAnimation 6s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes sweepAnimation {
          0% {
            transform: skewX(-20deg) translate3d(-180%, 0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          28% {
            transform: skewX(-20deg) translate3d(480%, 0, 0);
            opacity: 0;
          }
          100% {
            transform: skewX(-20deg) translate3d(480%, 0, 0);
            opacity: 0;
          }
        }

        /* 9. Interactive "Pay with QPay →" CTA with Breathing Glow */
        .qpay-cta-interactive-anchor {
          position: absolute;
          left: 10.2%;
          top: 71.5%;
          width: 19.8%;
          height: 16%;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justifyContent: center;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          padding: 0;
          transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.4, 1);
          animation: ctaBreathPulse 6s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes ctaBreathPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.035);
          }
        }

        .qpay-cta-glow-ring {
          position: absolute;
          inset: -2px;
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgba(46, 131, 255, 0.6) 0%,
            rgba(56, 189, 248, 0.25) 50%,
            transparent 75%
          );
          opacity: 0.7;
          animation: ctaGlowBreath 6s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes ctaGlowBreath {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.98);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.08);
          }
        }

        .qpay-hero-banner-container:hover .qpay-cta-interactive-anchor {
          transform: scale(1.04);
        }

        .qpay-hero-banner-container:active .qpay-cta-interactive-anchor {
          transform: scale(0.96);
        }

        /* 10. Touch active feedback */
        .qpay-hero-banner-container:active {
          transform: scale(0.995) translateZ(0);
          transition: transform 0.1s ease;
        }
      `}</style>

      {/* 1. Base High-Resolution Official Visual Canvas */}
      <img
        src={heroPromoImg}
        alt="QPay - Payments, made simple. Fast. Trusted. QPay."
        className="qpay-hero-base-image"
        loading="eager"
        decoding="async"
      />

      {/* 2. Floating QPay 3D Card Layer */}
      <div className="qpay-card-float-layer">
        <div className="qpay-card-glow-specular" />
      </div>

      {/* 3. Floating Smartphone Parallax Layer & Screen Check Pulse */}
      <div className="qpay-phone-float-layer">
        <div className="qpay-phone-check-pulse" />
      </div>

      {/* 4. Glowing Orbital Energy Ring around Phone */}
      <div className="qpay-orbital-ring-container">
        <svg className="qpay-orbital-svg-ring" viewBox="0 0 200 120" fill="none">
          <ellipse
            cx="100"
            cy="60"
            rx="90"
            ry="45"
            stroke="url(#orbitalGradient)"
            strokeWidth="2.5"
            strokeDasharray="18 10 32 8"
            opacity="0.85"
          />
          <ellipse
            cx="100"
            cy="60"
            rx="89"
            ry="44"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeDasharray="6 24 10 30"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="orbitalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#2e83ff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 5. Floating Rupee Coins Specular Highlights */}
      <div className="qpay-coin-top">
        <div className="qpay-coin-sheen" />
      </div>
      <div className="qpay-coin-bottom">
        <div className="qpay-coin-sheen" />
      </div>

      {/* 6. Ambient Constellation Light Particles */}
      <div className="qpay-particle qpay-p1" />
      <div className="qpay-particle qpay-p2" />
      <div className="qpay-particle qpay-p3" />
      <div className="qpay-particle qpay-p4" />
      <div className="qpay-particle qpay-p5" />

      {/* 7. Dynamic Luxury Diagonal Light Sweep */}
      <div className="qpay-light-sweep-layer" />

      {/* 8. Interactive Accessible "Pay with QPay →" CTA with Breathing Glow */}
      <button
        type="button"
        className="qpay-cta-interactive-anchor"
        onClick={handleCtaClick}
        aria-label="Pay with QPay"
      >
        <span className="qpay-cta-glow-ring" />
      </button>
    </div>
  );
};

export default QPayHeroBanner;
