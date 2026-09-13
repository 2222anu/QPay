import React, { useState, useRef } from 'react';
import type { BankAccount } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useApp } from '../state/AppContext';
import { Landmark, Eye, EyeOff, Plus, ChevronRight, ShieldCheck } from 'lucide-react';

interface BankCardCarouselProps {
  banks: BankAccount[];
}

const getBankStyle = (bankName: string) => {
  const nameUpper = bankName.toUpperCase();
  if (nameUpper.includes('RAJHI')) {
    return {
      gradient: 'linear-gradient(135deg, #071b3e 0%, #0d367e 50%, #1e5fc2 100%)',
      tagText: 'AL RAJHI BANK',
      shortName: 'AL RAJHI',
    };
  }
  if (nameUpper.includes('SNB') || nameUpper.includes('NATIONAL BANK') || nameUpper.includes('AHLI')) {
    return {
      gradient: 'linear-gradient(135deg, #052617 0%, #0c4a2e 50%, #107c41 100%)',
      tagText: 'SAUDI NATIONAL BANK',
      shortName: 'SNB',
    };
  }
  if (nameUpper.includes('RIYAD')) {
    return {
      gradient: 'linear-gradient(135deg, #2a0b16 0%, #58162b 50%, #9f1239 100%)',
      tagText: 'RIYAD BANK',
      shortName: 'RIYAD',
    };
  }
  if (nameUpper.includes('INMA')) {
    return {
      gradient: 'linear-gradient(135deg, #231608 0%, #52340f 50%, #a16207 100%)',
      tagText: 'ALINMA BANK',
      shortName: 'ALINMA',
    };
  }
  if (nameUpper.includes('SAB') || nameUpper.includes('AWWAL')) {
    return {
      gradient: 'linear-gradient(135deg, #320a10 0%, #6e101f 50%, #b91c1c 100%)',
      tagText: 'SAB BANK',
      shortName: 'SAB',
    };
  }
  if (nameUpper.includes('HDFC')) {
    return {
      gradient: 'linear-gradient(135deg, #001f3f 0%, #003366 50%, #0284c7 100%)',
      tagText: 'HDFC BANK',
      shortName: 'HDFC',
    };
  }
  return {
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%)',
    tagText: bankName.toUpperCase(),
    shortName: bankName.toUpperCase(),
  };
};

export const BankCardCarousel: React.FC<BankCardCarouselProps> = ({ banks }) => {
  const { navigateTo, openPinModal, toggleShowBalance, setIsAddBankModalOpen } = useApp();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftState(carouselRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const cardWidth = 310;
    const scrollPos = carouselRef.current.scrollLeft;
    const index = Math.round(scrollPos / cardWidth);
    setActiveCardIndex(Math.min(Math.max(index, 0), banks.length - 1));
  };

  const handleCardBalanceClick = (bank: BankAccount, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bank.showBalance) {
      toggleShowBalance(bank.id);
    } else {
      openPinModal({
        title: `Check ${bank.bankName} Balance`,
        subTitle: `${bank.accountType} • ${bank.accountNumberMasked}`,
        amount: bank.balance,
        onSuccess: () => toggleShowBalance(bank.id),
      });
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            My Bank Accounts
          </h3>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: '#eef5ff',
              color: '#2e83ff',
              padding: '2px 8px',
              borderRadius: '12px',
              border: '1px solid #d6e6ff',
            }}
          >
            {banks.length} Linked
          </span>
        </div>

        <button
          onClick={() => navigateTo('BANK_ACCOUNTS')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '12px',
            fontWeight: 700,
            color: '#2e83ff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          Manage <ChevronRight size={14} />
        </button>
      </div>

      {/* Swipable Cards Container */}
      <div
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          gap: '14px',
          overflowX: 'auto',
          scrollSnapType: isMouseDown ? 'none' : 'x mandatory',
          padding: '4px 20px 8px 20px',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          cursor: isMouseDown ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        {banks.map((bank) => {
          const style = getBankStyle(bank.bankName);
          const rawNumbers = bank.accountNumberMasked.replace(/[^0-9]/g, '') || '3616';

          return (
            <div
              key={bank.id}
              onClick={() => navigateTo('BANK_ACCOUNTS')}
              style={{
                scrollSnapAlign: 'start',
                flex: '0 0 300px',
                height: '175px',
                background: style.gradient,
                borderRadius: '14px',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                cursor: 'pointer',
                color: '#ffffff',
                position: 'relative',
                overflow: 'hidden',
                border: bank.isPrimary ? '1.5px solid rgba(255, 255, 255, 0.35)' : '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              {/* Subtle Atmospheric Light Gradients */}
              <div
                style={{
                  position: 'absolute',
                  top: '-40%',
                  right: '-25%',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-30%',
                  left: '-10%',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(46, 131, 255, 0.25) 0%, transparent 75%)',
                  pointerEvents: 'none',
                }}
              />

              {/* 1. Card Top Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <Landmark size={17} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.02em', lineHeight: '16px' }}>
                      {style.tagText}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.75)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{bank.accountType}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <ShieldCheck size={11} color="#60a5fa" /> UPI Linked
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Pill Badge */}
                {bank.isPrimary && (
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      backgroundColor: 'rgba(255, 255, 255, 0.22)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.35)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    PRIMARY
                  </span>
                )}
              </div>

              {/* 2. Middle Row: Chip Graphic + Masked Number */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2, margin: '6px 0' }}>
                {/* Gold EMV Chip SVG */}
                <div style={{ width: '32px', height: '23px', borderRadius: '4px', background: 'linear-gradient(135deg, #ffd700 0%, #e6a817 50%, #b8860b 100%)', padding: '2px', boxSizing: 'border-box', border: '1px solid rgba(0,0,0,0.15)' }}>
                  <div style={{ width: '100%', height: '100%', border: '0.5px solid rgba(0,0,0,0.2)', borderRadius: '2px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: '2px 0' }}>
                    <div style={{ height: '0.5px', backgroundColor: 'rgba(0,0,0,0.25)', width: '100%' }} />
                    <div style={{ height: '0.5px', backgroundColor: 'rgba(0,0,0,0.25)', width: '100%' }} />
                  </div>
                </div>

                {/* Masked Card Number */}
                <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.18em', color: '#ffffff', fontFamily: 'monospace' }}>
                  ••••  ••••  ••••  {rawNumbers}
                </div>
              </div>

              {/* 3. Card Footer: Available Balance & Clean Check Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 2 }}>
                <div>
                  <div style={{ fontSize: '9.5px', color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>
                    Available Balance
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', marginTop: '2px', letterSpacing: '0.01em' }}>
                    {bank.showBalance ? formatCurrency(bank.balance) : 'SAR ••••••••'}
                  </div>
                </div>

                <button
                  onClick={(e) => handleCardBalanceClick(bank, e)}
                  title="Check Bank Balance with UPI PIN"
                  style={{
                    backgroundColor: bank.showBalance ? 'rgba(255, 255, 255, 0.18)' : '#ffffff',
                    color: bank.showBalance ? '#ffffff' : '#0f172a',
                    border: bank.showBalance ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: 'none',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  {bank.showBalance ? <EyeOff size={13} /> : <Eye size={13} color="#0f172a" />}
                  {bank.showBalance ? 'Hide' : 'Check Balance'}
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Bank CTA Card */}
        <div
          onClick={() => setIsAddBankModalOpen(true)}
          style={{
            scrollSnapAlign: 'start',
            flex: '0 0 135px',
            height: '175px',
            backgroundColor: '#ffffff',
            border: '2px dashed #cbd5e1',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#eef5ff',
              color: '#2e83ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #d6e6ff',
            }}
          >
            <Plus size={20} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Add Bank</span>
          <span style={{ fontSize: '10.5px', color: '#64748b' }}>Link new account</span>
        </div>
      </div>

      {/* Card Pagination Indicator Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
        {banks.map((_, i) => (
          <span
            key={i}
            style={{
              width: i === activeCardIndex ? '16px' : '6px',
              height: '6px',
              borderRadius: '3px',
              backgroundColor: i === activeCardIndex ? '#2e83ff' : '#cbd5e1',
              transition: 'all 0.25s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};
