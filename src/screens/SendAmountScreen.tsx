import React, { useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../state/AppContext';
import type { Contact } from '../types';
import { ShieldCheck, MessageSquare } from 'lucide-react';

export const SendAmountScreen: React.FC = () => {
  const { screenParams, openPinModal, contacts, navigateTo } = useApp();
  const contact: Contact = screenParams.contact || contacts[0] || {
    id: 'default',
    name: 'Priya Menon',
    upiId: 'priya@paytm',
    avatarInitials: 'PM',
    mobile: '+966 50 123 0001',
  };

  const initialAmount = screenParams.defaultAmount ? String(screenParams.defaultAmount) : '';
  const [amountStr, setAmountStr] = useState<string>(initialAmount);
  const [note, setNote] = useState<string>('');

  const numAmount = parseFloat(amountStr) || 0;

  const handlePayClick = () => {
    if (numAmount <= 0) return;

    openPinModal({
      title: `Pay ${contact.name}`,
      amount: numAmount,
      subTitle: `To ${contact.upiId}`,
      onSuccess: () => {
        navigateTo('PAYMENT_SUCCESS', {
          recipientName: contact.name,
          amount: numAmount,
          upiId: contact.upiId,
          type: 'sent',
        });
      },
    });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '32px' }}>
      <AppHeader title="Send Money" showBack />

      <div style={{ padding: '20px', textAlign: 'center' }}>
        {/* Recipient Profile Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px 20px',
            marginBottom: '20px',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#2e83ff',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              border: '3px solid #ffffff',
              outline: '2px solid #d6e6ff',
            }}
          >
            {contact.avatarInitials}
          </div>
          <h2 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '4px', color: '#0f172a', letterSpacing: '-0.01em' }}>
            {contact.name}
          </h2>
          <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span>{contact.upiId}</span>
            <span>&bull;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#2e83ff', fontWeight: 700 }}>
              <ShieldCheck size={14} /> Verified
            </span>
          </div>
        </div>

        {/* Amount Input Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px 20px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              color: '#64748b',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Enter Amount
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#2e83ff' }}>SAR</span>
            <input
              type="number"
              inputMode="decimal"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0"
              autoFocus
              className="tabular-nums"
              style={{
                fontSize: amountStr.length > 5 ? '34px' : '44px',
                fontWeight: 900,
                color: '#0f172a',
                background: 'none',
                border: 'none',
                outline: 'none',
                maxWidth: '220px',
                width: '100%',
                textAlign: 'center',
                padding: 0,
                transition: 'font-size 0.15s ease',
              }}
            />
          </div>

          {/* Quick Amount Chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', justifyContent: 'center' }}>
            {['100', '500', '1000', '2000', '5000'].map((val) => {
              const isSelected = amountStr === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmountStr(val)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: isSelected ? '#eef5ff' : '#f8fafc',
                    border: isSelected ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                    color: isSelected ? '#2e83ff' : '#0f172a',
                    borderRadius: '20px',
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  +{val} SAR
                </button>
              );
            })}
          </div>

          {/* Optional Note Field */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '10px 14px',
            }}
          >
            <MessageSquare size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Add a note (e.g. Dinner, Rent, Groceries)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <PrimaryButton onClick={handlePayClick} disabled={numAmount <= 0}>
          Pay SAR {numAmount ? numAmount.toLocaleString('en-US') : '0'}
        </PrimaryButton>
      </div>
    </div>
  );
};
