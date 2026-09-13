import React, { useState } from 'react';
import { Copy, ShieldCheck, Key, QrCode, CheckCircle2 } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { ListRow } from '../components/ListRow';
import { Modal } from '../components/Modal';
import { useApp } from '../state/AppContext';

export const UPISettingsScreen: React.FC = () => {
  const { user, navigateTo } = useApp();
  const [copied, setCopied] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (oldPin.length !== 4) {
      setPinError('Old UPI PIN must be 4 digits');
      return;
    }
    if (newPin.length !== 4) {
      setPinError('New UPI PIN must be 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('New PIN and Confirm PIN do not match');
      return;
    }

    setPinSuccess(true);
    setTimeout(() => {
      setPinSuccess(false);
      setIsPinModalOpen(false);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
    }, 1200);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '30px' }}>
      <AppHeader title="UPI Settings" showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* Active UPI ID Banner */}
        <div
          style={{
            background: 'linear-gradient(145deg, #0e274d 0%, #0a1c36 100%)',
            border: '1.5px solid rgba(46, 131, 255, 0.35)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            color: '#FFFFFF',
          }}
        >
          <div style={{ fontSize: '11px', color: '#82b5ff', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
            Primary UPI ID
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '17px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '0.01em' }}>
              {user.upiId}
            </span>
            <button
              onClick={handleCopy}
              className="interactive-tap"
              style={{
                backgroundColor: '#2e83ff',
                border: 'none',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Copy size={13} /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Config Menu Items */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <ListRow
            icon={<QrCode size={18} color="#2e83ff" />}
            label="My QR Code"
            onClick={() => navigateTo('RECEIVE')}
          />
          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0 16px' }} />
          <ListRow
            icon={<Key size={18} color="#2e83ff" />}
            label="Change UPI PIN"
            onClick={() => setIsPinModalOpen(true)}
          />
          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0 16px' }} />
          <ListRow
            icon={<ShieldCheck size={18} color="#2e83ff" />}
            label="UPI Payment Limit"
            rightElement={<span style={{ fontSize: '11px', color: '#2e83ff', fontWeight: '800', backgroundColor: '#eef5ff', border: '1px solid #d6e6ff', padding: '3px 8px', borderRadius: '6px' }}>SAR 100,000 / day</span>}
          />
        </div>
      </div>

      {/* Change PIN Modal */}
      <Modal isOpen={isPinModalOpen} onClose={() => setIsPinModalOpen(false)} title="Change UPI PIN">
        {pinSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={44} color="#2e83ff" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>UPI PIN Changed Successfully!</h4>
          </div>
        ) : (
          <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pinError && (
              <div style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '12px', fontWeight: '700' }}>
                {pinError}
              </div>
            )}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                Current 4-Digit UPI PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                required
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '18px', textAlign: 'center', letterSpacing: '8px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                New 4-Digit UPI PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                required
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '18px', textAlign: 'center', letterSpacing: '8px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                Confirm New UPI PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                required
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '18px', textAlign: 'center', letterSpacing: '8px', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              className="interactive-tap"
              style={{
                marginTop: '10px',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#2e83ff',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Update UPI PIN
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};

