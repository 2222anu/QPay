import React, { useState } from 'react';
import {
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Plus,
  Wifi,
  Sliders,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { Modal } from '../components/Modal';
import { useApp } from '../state/AppContext';
import { MockCardProvider, INITIAL_CARDS } from '../services/providers/mockAdapters';
import type { QTPayCard } from '../types/fintech';
import { formatCurrency } from '../utils/formatters';

const cardProvider = new MockCardProvider();

export const CardsScreen: React.FC = () => {
  const { openPinModal } = useApp();

  const [cards, setCards] = useState<QTPayCard[]>(INITIAL_CARDS);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isDetailsRevealed, setIsDetailsRevealed] = useState<boolean>(false);
  const [isIssuingCard, setIsIssuingCard] = useState<boolean>(false);
  const [isLimitsModalOpen, setIsLimitsModalOpen] = useState<boolean>(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState<boolean>(false);
  const [replaceReason, setReplaceReason] = useState<string>('Damaged / Worn Out');

  const currentCard = cards[activeCardIndex] || cards[0];

  const handleToggleReveal = () => {
    if (isDetailsRevealed) {
      setIsDetailsRevealed(false);
    } else {
      // Authentication-gated: requires PIN to view CVV and full card number
      openPinModal({
        title: 'Reveal Card Details',
        subTitle: 'Authorize with UPI PIN to view sensitive card credentials',
        amount: 0,
        onSuccess: () => {
          setIsDetailsRevealed(true);
          // Auto-hide after 30 seconds for security
          setTimeout(() => setIsDetailsRevealed(false), 30000);
        },
      });
    }
  };

  const handleToggleFreeze = async () => {
    if (!currentCard) return;
    const nextStatus = currentCard.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
    const updated = await cardProvider.updateCardStatus(currentCard.id, nextStatus);
    setCards((prev) => prev.map((c) => (c.id === currentCard.id ? updated : c)));
  };

  const handleIssueVirtualCard = async () => {
    setIsIssuingCard(true);
    const newCard = await cardProvider.issueVirtualCard('Anu', 'b-icici');
    setCards((prev) => [newCard, ...prev]);
    setActiveCardIndex(0);
    setIsIssuingCard(false);
  };

  const handleSaveLimits = async (updatedLimits: QTPayCard['limits']) => {
    if (!currentCard) return;
    const updated = await cardProvider.updateCardLimits(currentCard.id, updatedLimits);
    setCards((prev) => prev.map((c) => (c.id === currentCard.id ? updated : c)));
    setIsLimitsModalOpen(false);
  };

  const handleConfirmReplace = async () => {
    if (!currentCard) return;
    const replacement = await cardProvider.replaceCard(currentCard.id, replaceReason);
    setCards((prev) => [replacement, ...prev.filter((c) => c.id !== currentCard.id)]);
    setIsReplaceModalOpen(false);
    setActiveCardIndex(0);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '36px' }}>
      <AppHeader title="Cards Hub" showBack />

      <div style={{ padding: '20px clamp(12px, 3.5vw, 20px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Card Selector Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
          {cards.map((card, idx) => {
            const isSelected = idx === activeCardIndex;
            return (
              <button
                key={card.id}
                onClick={() => {
                  setActiveCardIndex(idx);
                  setIsDetailsRevealed(false);
                }}
                className="interactive-tap"
                style={{
                  backgroundColor: isSelected ? '#2e83ff' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#0f172a',
                  border: isSelected ? '1px solid #2e83ff' : '1px solid #cbd5e1',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CreditCard size={14} />
                <span>{card.network} ({card.cardType})</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Virtual Card Display Container */}
        {currentCard && (
          <div
            className="interactive-tap"
            style={{
              position: 'relative',
              borderRadius: '20px',
              padding: '22px clamp(14px, 3.5vw, 22px)',
              background: currentCard.status === 'FROZEN'
                ? 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
                : 'linear-gradient(135deg, #071529 0%, #0a2540 50%, #1d4ed8 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '210px',
              overflow: 'hidden',
              boxShadow: 'none',
              filter: currentCard.status === 'FROZEN' ? 'grayscale(0.6)' : 'none',
              transition: 'filter 0.3s ease',
            }}
          >
            {/* Top Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em' }}>QTPay</span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  {currentCard.cardType}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wifi size={18} color="rgba(255, 255, 255, 0.8)" />
                {currentCard.status === 'FROZEN' && (
                  <span style={{ backgroundColor: '#ef4444', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                    FROZEN
                  </span>
                )}
              </div>
            </div>

            {/* Middle Card Number */}
            <div style={{ margin: '20px 0 10px 0' }}>
              <div
                className="tabular-nums"
                style={{
                  fontSize: 'clamp(16px, 4.8vw, 20px)',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#ffffff',
                  fontFamily: 'monospace',
                }}
              >
                {isDetailsRevealed ? currentCard.fullCardNumberSecure : currentCard.maskedNumber}
              </div>
            </div>

            {/* Bottom Details Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ minWidth: 0, flex: '1 1 auto', marginRight: '8px' }}>
                <span style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Cardholder
                </span>
                <div style={{ fontSize: '12.5px', fontWeight: 800, letterSpacing: '0.02em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentCard.cardholderName}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'clamp(10px, 2.5vw, 20px)', flexShrink: 0 }}>
                <div>
                  <span style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Expires
                  </span>
                  <div style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'monospace' }}>
                    {currentCard.expiryMonth}/{currentCard.expiryYear}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    CVV
                  </span>
                  <div style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'monospace', color: isDetailsRevealed ? '#38bdf8' : '#ffffff' }}>
                    {isDetailsRevealed ? currentCard.cvvSecure : '•••'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '-0.01em', color: '#ffffff' }}>
                    {currentCard.network}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reveal / Unmask Actions Bar */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleToggleReveal}
            className="interactive-tap"
            style={{
              flex: 1,
              backgroundColor: '#ffffff',
              border: '1.5px solid #2e83ff',
              color: '#2e83ff',
              borderRadius: '12px',
              padding: '12px 6px',
              fontSize: 'clamp(11.5px, 3.2vw, 13px)',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {isDetailsRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{isDetailsRevealed ? 'Hide Details' : 'Reveal Full Details'}</span>
          </button>

          <button
            onClick={handleToggleFreeze}
            className="interactive-tap"
            style={{
              flex: 1,
              backgroundColor: currentCard?.status === 'FROZEN' ? '#eef5ff' : '#ffffff',
              border: `1.5px solid ${currentCard?.status === 'FROZEN' ? '#2e83ff' : '#cbd5e1'}`,
              color: currentCard?.status === 'FROZEN' ? '#2e83ff' : '#0f172a',
              borderRadius: '12px',
              padding: '12px 6px',
              fontSize: 'clamp(11.5px, 3.2vw, 13px)',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Lock size={16} />
            <span>{currentCard?.status === 'FROZEN' ? 'Unfreeze Card' : 'Freeze Card'}</span>
          </button>
        </div>

        {/* Card Management Tools Grid */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            overflow: 'hidden',
          }}
        >
          {/* Card Limits */}
          <div
            onClick={() => setIsLimitsModalOpen(true)}
            className="interactive-tap"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#eef5ff',
                  color: '#2e83ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sliders size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                  Manage Card Limits
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Online, Contactless POS, ATM & International
                </div>
              </div>
            </div>
            <ArrowRight size={16} color="#64748b" />
          </div>

          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0 16px' }} />

          {/* Replace Card */}
          <div
            onClick={() => setIsReplaceModalOpen(true)}
            className="interactive-tap"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#eef5ff',
                  color: '#2e83ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RefreshCw size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a' }}>
                  Replace or Block Card
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Instant re-issuance for lost or damaged cards
                </div>
              </div>
            </div>
            <ArrowRight size={16} color="#64748b" />
          </div>
        </div>

        {/* Request New Virtual Card */}
        <div>
          <PrimaryButton onClick={handleIssueVirtualCard} disabled={isIssuingCard}>
            <Plus size={18} /> {isIssuingCard ? 'Generating Virtual Card...' : 'Issue New Virtual RuPay Card'}
          </PrimaryButton>
        </div>

        {/* Card Recent Transactions */}
        <div style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', marginLeft: '4px' }}>
            Card Activity
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#eef5ff',
                    color: '#2e83ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CreditCard size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Amazon KSA</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>E-Commerce Purchase &bull; Today</div>
                </div>
              </div>
              <div className="tabular-nums" style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                -SAR 2,499.00
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#eef5ff',
                    color: '#2e83ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Wifi size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Riyadh Metro Tap</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Contactless POS &bull; Yesterday</div>
                </div>
              </div>
              <div className="tabular-nums" style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                -SAR 45.00
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Card Limits */}
      {currentCard && (
        <Modal
          isOpen={isLimitsModalOpen}
          onClose={() => setIsLimitsModalOpen(false)}
          title="Card Spending Limits"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '4px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Online Transactions</div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>E-commerce and web purchases</div>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#2e83ff' }}>
                {formatCurrency(currentCard.limits.onlineLimit)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Contactless Tap & Pay</div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>NFC tap limits without PIN</div>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#2e83ff' }}>
                {formatCurrency(currentCard.limits.posContactlessLimit)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>ATM Cash Withdrawal</div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Daily ATM limit</div>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#2e83ff' }}>
                {formatCurrency(currentCard.limits.atmLimit)}
              </span>
            </div>

            <PrimaryButton onClick={() => handleSaveLimits(currentCard.limits)}>
              Save Preferences
            </PrimaryButton>
          </div>
        </Modal>
      )}

      {/* Modal: Replace Card */}
      <Modal
        isOpen={isReplaceModalOpen}
        onClose={() => setIsReplaceModalOpen(false)}
        title="Replace or Block Card"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '4px 0' }}>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
            Your current card will be immediately deactivated and a new secure virtual card will be provisioned.
          </p>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
              Reason for Replacement
            </label>
            <select
              value={replaceReason}
              onChange={(e) => setReplaceReason(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0f172a',
                outline: 'none',
              }}
            >
              <option value="Damaged / Worn Out">Damaged / Worn Out</option>
              <option value="Suspected Fraud / Compromised">Suspected Fraud / Compromised</option>
              <option value="Upgrade to mada Platinum">Upgrade to mada Platinum</option>
            </select>
          </div>

          <PrimaryButton onClick={handleConfirmReplace}>
            Confirm & Issue Replacement
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};
