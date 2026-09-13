import React, { useState } from 'react';
import {
  Store,
  QrCode,
  Smartphone,
  Volume2,
  Download,
  Share2,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { QRCodeView } from '../components/QRCodeView';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { Modal } from '../components/Modal';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';

export const MerchantDashboardScreen: React.FC = () => {
  const { navigateTo } = useApp();

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [settlementSuccess, setSettlementSuccess] = useState(false);
  const [todayCollections, setTodayCollections] = useState(18450.0);

  const merchantUpi = 'anusuper@icici';
  const qrPayload = `upi://pay?pa=${encodeURIComponent(merchantUpi)}&pn=Anu%20Super%20Retail&mc=5411&cu=INR`;

  const handleInstantPayout = () => {
    setSettlementSuccess(true);
    setTodayCollections(0);
    setTimeout(() => setSettlementSuccess(false), 3500);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '36px' }}>
      <AppHeader
        title="Merchant Business Hub"
        showBack
        onBack={() => navigateTo('HOME')}
        rightAction={
          <button
            onClick={() => navigateTo('HOME')}
            className="interactive-tap"
            style={{
              backgroundColor: '#eef5ff',
              border: '1px solid #d6e6ff',
              borderRadius: '20px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#2e83ff',
              cursor: 'pointer',
            }}
          >
            Personal Mode
          </button>
        }
      />

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Merchant Store Luxury Hero Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #071529 0%, #0a2540 50%, #1d4ed8 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '20px',
            padding: '22px 20px',
            color: '#ffffff',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Store size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Anu Super Retail
                </h2>
                <div style={{ fontSize: '11.5px', color: '#82b5ff', marginTop: '2px' }}>
                  UPI: {merchantUpi} &bull; Retail & Grocery
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(46, 131, 255, 0.25)',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                color: '#38bdf8',
                borderRadius: '12px',
                padding: '4px 10px',
                fontSize: '10px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CheckCircle2 size={12} color="#38bdf8" /> VERIFIED MERCHANT
            </div>
          </div>

          {/* Today's Collections Stats */}
          <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase' }}>
                Today's Collections
              </span>
              <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
                {formatCurrency(todayCollections)}
              </div>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <TrendingUp size={13} /> 34 customer transactions today
              </div>
            </div>

            <button
              onClick={handleInstantPayout}
              disabled={todayCollections === 0}
              className="interactive-tap"
              style={{
                backgroundColor: '#2e83ff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: todayCollections === 0 ? 'not-allowed' : 'pointer',
                opacity: todayCollections === 0 ? 0.6 : 1,
              }}
            >
              Settle Now
            </button>
          </div>

          {settlementSuccess && (
            <div
              className="fade-in"
              style={{
                marginTop: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#34d399',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle2 size={14} /> Payout of ₹18,450.00 transferred to HDFC Bank ****1234 instantly!
            </div>
          )}
        </div>

        {/* Core Merchant Fintech Tools Grid */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', marginLeft: '4px' }}>
            Merchant Acceptance Suite
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {/* 1. Store Standee QR */}
            <div
              onClick={() => setIsQrModalOpen(true)}
              className="interactive-tap"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#eef5ff',
                  color: '#2e83ff',
                  border: '1px solid #d6e6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <QrCode size={22} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Store QR</div>
                <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>Standee & Print</div>
              </div>
            </div>

            {/* 2. SoftPOS (Tap to Pay) */}
            <div
              onClick={() => navigateTo('SOFTPOS')}
              className="interactive-tap"
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #2e83ff',
                borderRadius: '16px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#eef5ff',
                  color: '#2e83ff',
                  border: '1px solid #d6e6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Smartphone size={22} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#2e83ff' }}>SoftPOS</div>
                <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>Tap to Pay</div>
              </div>
            </div>

            {/* 3. Sound Box */}
            <div
              onClick={() => navigateTo('SOUND_BOX')}
              className="interactive-tap"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#eef5ff',
                  color: '#2e83ff',
                  border: '1px solid #d6e6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Volume2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Sound Box</div>
                <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>Voice Alerts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Transactions Table */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', marginLeft: '4px' }}>
            Recent Received Payments
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
                    fontWeight: 800,
                    fontSize: '13px',
                  }}
                >
                  PM
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Priya Menon</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>UPI QR Scan &bull; 10:42 AM</div>
                </div>
              </div>
              <div className="tabular-nums" style={{ fontSize: '14.5px', fontWeight: 800, color: '#2e83ff' }}>
                +₹450.00
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
                    fontWeight: 800,
                    fontSize: '13px',
                  }}
                >
                  RS
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Rahul Sharma</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>SoftPOS Tap &bull; 09:15 AM</div>
                </div>
              </div>
              <div className="tabular-nums" style={{ fontSize: '14.5px', fontWeight: 800, color: '#2e83ff' }}>
                +₹1,200.00
              </div>
            </div>
          </div>
        </div>

        {/* Switch back to Customer App */}
        <div style={{ marginTop: '8px' }}>
          <SecondaryButton onClick={() => navigateTo('HOME')}>
            Exit to Personal Customer Account
          </SecondaryButton>
        </div>
      </div>

      {/* Modal: Store Countertop QR */}
      <Modal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} title="Store Standee QR Code">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '10px 0' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #2e83ff',
              borderRadius: '20px',
              padding: '24px',
              width: '260px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginBottom: '2px' }}>
              Anu Super Retail
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '14px' }}>
              Scan & Pay using any UPI App
            </div>

            <QRCodeView value={qrPayload} size={180} />

            <div style={{ marginTop: '14px', fontSize: '12px', fontWeight: 800, color: '#2e83ff' }}>
              {merchantUpi}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <PrimaryButton onClick={() => setIsQrModalOpen(false)}>
              <Share2 size={16} /> Share QR
            </PrimaryButton>
            <SecondaryButton onClick={() => setIsQrModalOpen(false)}>
              <Download size={16} /> Print Standee
            </SecondaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};
