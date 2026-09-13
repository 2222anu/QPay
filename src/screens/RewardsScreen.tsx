import React, { useState } from 'react';
import { Gift, Trophy, Sparkles, X, CheckCircle } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';

interface ScratchCardItem {
  id: string;
  title: string;
  subtitle: string;
  rewardText: string;
  rewardType: 'cashback' | 'voucher' | 'points';
  amount?: number;
  isScratched: boolean;
  code?: string;
}

export const RewardsScreen: React.FC = () => {
  const [points, setPoints] = useState(1450);
  const [cards, setCards] = useState<ScratchCardItem[]>([
    {
      id: 'sc-1',
      title: 'UPI Transfer Reward',
      subtitle: 'Earned on SAR 2,620 SEC Electricity Payment',
      rewardText: 'SAR 150 Instant Cashback',
      rewardType: 'cashback',
      amount: 150,
      isScratched: false,
    },
    {
      id: 'sc-2',
      title: 'Merchant Super Saver',
      subtitle: 'Earned at Tamimi Markets',
      rewardText: 'Flat 25% Off Food & Groceries',
      rewardType: 'voucher',
      code: 'QTPAYFOOD25',
      isScratched: false,
    },
    {
      id: 'sc-3',
      title: 'Weekend Bonus Scratch',
      subtitle: 'Special reward for 5+ UPI transactions',
      rewardText: '+500 Extra QTPoints',
      rewardType: 'points',
      amount: 500,
      isScratched: false,
    },
    {
      id: 'sc-4',
      title: 'Travel Special Voucher',
      subtitle: 'Flight booking discount card',
      rewardText: 'Flat SAR 150 Flight Discount',
      rewardType: 'voucher',
      code: 'FLYQTPAY750',
      isScratched: true,
    },
  ]);

  const [activeCard, setActiveCard] = useState<ScratchCardItem | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleCardClick = (card: ScratchCardItem) => {
    setActiveCard(card);
    setIsRevealed(card.isScratched);
    setIsScratching(false);
  };

  const handleScratchAction = () => {
    if (!activeCard || isRevealed) return;
    setIsScratching(true);
    setTimeout(() => {
      setIsScratching(false);
      setIsRevealed(true);

      // Update card state
      setCards((prev) =>
        prev.map((c) => (c.id === activeCard.id ? { ...c, isScratched: true } : c))
      );

      // Add points if points reward
      if (activeCard.rewardType === 'points' && activeCard.amount) {
        setPoints((p) => p + activeCard.amount!);
      }
    }, 1200);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '30px' }}>
      <AppHeader title="Rewards & Scratch Cards" showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* QTPoints Balance Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(145deg, #0e274d 0%, #0a1c36 100%)',
            border: '1.5px solid rgba(46, 131, 255, 0.35)',
            borderRadius: '20px',
            padding: '24px 20px',
            textAlign: 'center',
            marginBottom: '20px',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#eef5ff',
              color: '#2e83ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              border: '1.5px solid #d6e6ff',
            }}
          >
            <Trophy size={28} />
          </div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#82b5ff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Total Reward Balance
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#FFFFFF', margin: '4px 0 6px 0', fontVariantNumeric: 'tabular-nums' }}>
            {points.toLocaleString()} QTPoints
          </h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            Earn 10 QTPoints on every SAR 100 spent via QPay UPI
          </p>
        </div>

        {/* Unlocked Scratch Cards Grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Unlocked Scratch Cards</h3>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#2e83ff' }}>
            {cards.filter((c) => !c.isScratched).length} Unopened
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="interactive-tap"
              style={{
                backgroundColor: card.isScratched ? '#ffffff' : '#0e274d',
                border: card.isScratched ? '1px solid #e2e8f0' : '1.5px dashed #2e83ff',
                borderRadius: '16px',
                padding: '18px 14px',
                textAlign: 'center',
                cursor: 'pointer',
                color: card.isScratched ? '#0f172a' : '#ffffff',
              }}
            >
              {card.isScratched ? (
                <>
                  <CheckCircle size={28} color="#2e83ff" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: '800', fontSize: '13px', color: '#0f172a' }}>{card.rewardText}</div>
                  <div style={{ fontSize: '11px', color: '#2e83ff', marginTop: '4px', fontWeight: '800' }}>Claimed</div>
                </>
              ) : (
                <>
                  <Sparkles size={28} color="#2e83ff" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: '800', fontSize: '13px', color: '#ffffff' }}>Tap to Scratch</div>
                  <div style={{ fontSize: '11px', color: '#82b5ff', marginTop: '4px', fontWeight: '700' }}>
                    {card.title}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Scratch Modal */}
      {activeCard && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setActiveCard(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              position: 'relative',
              animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveCard(null)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '8px 0 4px 0' }}>
              {activeCard.title}
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px 0' }}>{activeCard.subtitle}</p>

            {/* Scratch Surface Box */}
            <div
              onClick={handleScratchAction}
              style={{
                width: '200px',
                height: '200px',
                margin: '0 auto 20px auto',
                borderRadius: '20px',
                backgroundColor: isRevealed ? '#eef5ff' : '#0e274d',
                border: isRevealed ? '2px solid #2e83ff' : '2px dashed #2e83ff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isRevealed ? 'default' : 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isScratching ? (
                <div>
                  <Sparkles size={36} color="#2e83ff" style={{ animation: 'spin 1s linear infinite' }} />
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF', marginTop: '10px' }}>
                    Revealing Reward...
                  </div>
                </div>
              ) : isRevealed ? (
                <div style={{ padding: '16px' }}>
                  <Gift size={40} color="#2e83ff" style={{ margin: '0 auto 10px auto' }} />
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                    {activeCard.rewardText}
                  </div>
                  {activeCard.code && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '6px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px dashed #2e83ff',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: '800',
                        color: '#2e83ff',
                        letterSpacing: '0.05em',
                      }}
                    >
                      CODE: {activeCard.code}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Sparkles size={40} color="#2e83ff" style={{ margin: '0 auto 10px auto' }} />
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>Tap to Scratch</div>
                  <div style={{ fontSize: '11px', color: '#82b5ff', marginTop: '4px' }}>Click to reveal your reward!</div>
                </div>
              )}
            </div>

            {isRevealed ? (
              <button
                onClick={() => setActiveCard(null)}
                className="interactive-tap"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: '#2e83ff',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                Claimed & Saved
              </button>
            ) : (
              <button
                onClick={handleScratchAction}
                className="interactive-tap"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: '#0e274d',
                  border: '1.5px solid #2e83ff',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                Scratch Now
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
