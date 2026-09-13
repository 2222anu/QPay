import React, { useState } from 'react';
import { Download, Share2, Copy, CheckCircle2, Sliders, X } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { QRCodeView } from '../components/QRCodeView';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { useApp } from '../state/AppContext';
import { qrService } from '../services/qrService';

export const ReceiveScreen: React.FC = () => {
  const { user, navigateTo } = useApp();
  const [copied, setCopied] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');

  const numAmount = parseFloat(customAmount) || undefined;
  const upiQrString = qrService.getUpiQrString(user.upiId, user.name, numAmount, customNote || undefined);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'QTPay UPI ID',
          text: numAmount
            ? `Pay ${user.name} SAR ${numAmount} via QTPay: ${user.upiId}`
            : `Pay ${user.name} via QTPay: ${user.upiId}`,
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  const qrSize = typeof window !== 'undefined' ? Math.max(160, Math.min(190, window.innerWidth - 130)) : 190;

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: 'calc(30px + env(safe-area-inset-bottom, 0px))' }}>
      <AppHeader title="Receive Money" showBack />

      <div style={{ padding: '20px clamp(12px, 3.5vw, 20px)', textAlign: 'center' }}>
        {/* White QR Showcase Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '24px',
            padding: '24px clamp(14px, 3.5vw, 20px)',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* User Avatar */}
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              backgroundColor: user.avatarBgColor || '#2e83ff',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px',
              border: '3px solid #eef5ff',
              overflow: 'hidden',
            }}
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              user.avatarInitials
            )}
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {user.name}
          </h2>

          {/* Copyable UPI ID pill */}
          <button
            onClick={handleCopy}
            className="interactive-tap"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#eef5ff',
              border: '1px solid #d6e6ff',
              borderRadius: '20px',
              padding: '6px 14px',
              marginTop: '6px',
              marginBottom: '16px',
              color: '#2e83ff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <span>{user.upiId}</span>
            {copied ? <CheckCircle2 size={14} color="#10b981" /> : <Copy size={13} />}
          </button>

          {/* Machine-Readable QR Code */}
          <div style={{ padding: '8px', backgroundColor: '#ffffff', borderRadius: '16px' }}>
            <QRCodeView value={upiQrString} size={qrSize} />
          </div>

          {/* Dynamic Amount Indicator */}
          {numAmount && (
            <div
              style={{
                marginTop: '12px',
                fontSize: '15px',
                fontWeight: 800,
                color: '#0f172a',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '6px 14px',
                borderRadius: '12px',
              }}
            >
              Requesting: SAR {numAmount.toLocaleString('en-US')}
            </div>
          )}

          {/* Dynamic Amount Toggle & Config */}
          <div style={{ marginTop: '14px', width: '100%' }}>
            {!showAmountInput ? (
              <button
                type="button"
                onClick={() => setShowAmountInput(true)}
                className="interactive-tap"
                style={{
                  background: 'none',
                  border: '1px dashed #2e83ff',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  color: '#2e83ff',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Sliders size={14} /> Set Custom Amount (Dynamic QR)
              </button>
            ) : (
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #d6e6ff',
                  borderRadius: '14px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                    Embedded Dynamic Amount
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAmountInput(false);
                      setCustomAmount('');
                      setCustomNote('');
                    }}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                </div>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="Enter amount (SAR)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="tabular-nums"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #2e83ff',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '15px',
                    fontWeight: 800,
                    color: '#0f172a',
                    outline: 'none',
                  }}
                />
                <input
                  type="text"
                  placeholder="Optional note (e.g. Lunch split)"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <PrimaryButton onClick={() => navigateTo('REQUEST_MONEY')}>
            <Download size={18} /> Request Money from Contact
          </PrimaryButton>
          <SecondaryButton onClick={handleShare}>
            <Share2 size={18} /> Share QR / UPI Details
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};
