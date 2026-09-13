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
  Landmark,
  ShieldCheck,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { QRCodeView } from '../components/QRCodeView';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { Modal } from '../components/Modal';
import { useApp } from '../state/AppContext';
import { formatCurrency } from '../utils/formatters';

interface MerchantTxn {
  id: string;
  customerName: string;
  time: string;
  method: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING';
}

const INITIAL_MERCHANT_TXNS: MerchantTxn[] = [
  { id: 'm-tx-1', customerName: 'Sara Al-Mansoor', time: '10:42 AM', method: 'QR Standee', amount: 450.0, status: 'SUCCESS' },
  { id: 'm-tx-2', customerName: 'Tariq Al-Harbi', time: '09:15 AM', method: 'SoftPOS Tap', amount: 1200.0, status: 'SUCCESS' },
  { id: 'm-tx-3', customerName: 'Omar Khalid', time: '08:50 AM', method: 'QR Standee', amount: 85.5, status: 'SUCCESS' },
  { id: 'm-tx-4', customerName: 'Fahad Al-Otaibi', time: 'Yesterday', method: 'SoftPOS Tap', amount: 320.0, status: 'SUCCESS' },
  { id: 'm-tx-5', customerName: 'Noura Al-Zahrani', time: 'Yesterday', method: 'QR Standee', amount: 120.0, status: 'PENDING' },
];

export const MerchantDashboardScreen: React.FC = () => {
  const { navigateTo } = useApp();

  const [todayCollections, setTodayCollections] = useState<number>(18450.0);
  const [totalSalesCount, setTotalSalesCount] = useState<number>(34);
  const [merchantTxns, setMerchantTxns] = useState<MerchantTxn[]>(INITIAL_MERCHANT_TXNS);
  const [txnFilter, setTxnFilter] = useState<'ALL' | 'SUCCESS' | 'PENDING'>('ALL');

  // Modals State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isBusinessInfoModalOpen, setIsBusinessInfoModalOpen] = useState(false);
  const [isAcceptPaymentModalOpen, setIsAcceptPaymentModalOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [settlementSuccess, setSettlementSuccess] = useState(false);

  // Accept Payment Custom Form State
  const [acceptAmount, setAcceptAmount] = useState<string>('150');
  const [paymentReceivedSimulated, setPaymentReceivedSimulated] = useState(false);

  // Saudi Merchant Business Credentials
  const merchantProfile = {
    tradeName: 'Anu Super Retail',
    legalName: 'Anu Trading & Retail LLC',
    crNumber: 'CR 1010892412',
    vatNumber: 'VAT 310294819200003',
    city: 'Riyadh, Saudi Arabia',
    bankName: 'Al Rajhi Bank',
    ibanMasked: 'SA92 8000 •••• •••• 3400 01',
    merchantUpi: 'anusuper@qtpay',
  };

  const qrPayload = `upi://pay?pa=${encodeURIComponent(merchantProfile.merchantUpi)}&pn=${encodeURIComponent(merchantProfile.tradeName)}&mc=5411&cu=SAR`;
  const dynamicQrPayload = `upi://pay?pa=${encodeURIComponent(merchantProfile.merchantUpi)}&pn=${encodeURIComponent(merchantProfile.tradeName)}&am=${acceptAmount || '0'}&cu=SAR`;

  const handleInstantPayout = () => {
    setSettlementSuccess(true);
    setTodayCollections(0);
    setTimeout(() => setSettlementSuccess(false), 3500);
  };

  const handleSimulateReceivePayment = () => {
    const num = parseFloat(acceptAmount) || 0;
    if (num <= 0) return;

    setPaymentReceivedSimulated(true);
    const newTxn: MerchantTxn = {
      id: `m-tx-${Date.now()}`,
      customerName: 'Customer Walk-in',
      time: 'Just now',
      method: 'Instant QR Receive',
      amount: num,
      status: 'SUCCESS',
    };

    setMerchantTxns((prev) => [newTxn, ...prev]);
    setTodayCollections((prev) => prev + num);
    setTotalSalesCount((prev) => prev + 1);

    setTimeout(() => {
      setPaymentReceivedSimulated(false);
      setIsAcceptPaymentModalOpen(false);
    }, 1600);
  };

  const filteredTxns = merchantTxns.filter((t) => {
    if (txnFilter === 'ALL') return true;
    return t.status === txnFilter;
  });

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
                  {merchantProfile.tradeName}
                </h2>
                <div style={{ fontSize: '11.5px', color: '#82b5ff', marginTop: '2px' }}>
                  {merchantProfile.crNumber} &bull; {merchantProfile.city}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsBusinessInfoModalOpen(true)}
              className="interactive-tap"
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
                cursor: 'pointer',
              }}
            >
              <CheckCircle2 size={12} color="#38bdf8" /> VERIFIED MERCHANT
            </button>
          </div>

          {/* Today's Collections Stats Card */}
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
                <TrendingUp size={13} /> {totalSalesCount} customer payments received today
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
              <CheckCircle2 size={14} /> Payout of {formatCurrency(18450.0)} transferred to {merchantProfile.bankName} instantly!
            </div>
          )}
        </div>

        {/* Financial Metrics Strip: Successful, Pending, Failed & Total Sales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {/* Successful */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px 10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Successful
            </div>
            <div className="tabular-nums" style={{ fontSize: '15px', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
              {totalSalesCount}
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>100% Settled</div>
          </div>

          {/* Pending */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px 10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Pending
            </div>
            <div className="tabular-nums" style={{ fontSize: '15px', fontWeight: 900, color: '#f59e0b', marginTop: '2px' }}>
              1
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>{formatCurrency(120.0)}</div>
          </div>

          {/* Failed */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px 10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Failed
            </div>
            <div className="tabular-nums" style={{ fontSize: '15px', fontWeight: 900, color: '#64748b', marginTop: '2px' }}>
              0
            </div>
            <div style={{ fontSize: '10px', color: '#10b981' }}>Zero Errors</div>
          </div>
        </div>

        {/* 4 Core Quick Actions */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', marginLeft: '4px' }}>
            Merchant Quick Actions
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {/* 1. Accept Payment */}
            <div
              onClick={() => setIsAcceptPaymentModalOpen(true)}
              className="interactive-tap"
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #2e83ff',
                borderRadius: '14px',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
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
                <PlusCircle size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#2e83ff' }}>Accept Pay</span>
            </div>

            {/* 2. Merchant QR */}
            <div
              onClick={() => setIsQrModalOpen(true)}
              className="interactive-tap"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <QrCode size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>Store QR</span>
            </div>

            {/* 3. SoftPOS Tap */}
            <div
              onClick={() => navigateTo('SOFTPOS')}
              className="interactive-tap"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Smartphone size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>SoftPOS</span>
            </div>

            {/* 4. Settlement Info */}
            <div
              onClick={() => setIsSettlementModalOpen(true)}
              className="interactive-tap"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Landmark size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>Settlement</span>
            </div>
          </div>
        </div>

        {/* Hardware SoundBox Voice Banner */}
        <div
          onClick={() => navigateTo('SOUND_BOX')}
          className="interactive-tap"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                border: '1px solid #d6e6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Volume2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>QTPay Smart Sound Box</div>
              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={12} /> Paired &bull; 4G Active &bull; Arabic / English
              </div>
            </div>
          </div>
          <ArrowRight size={16} color="#64748b" />
        </div>

        {/* Received Transactions Table */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginLeft: '4px' }}>
              Recent Received Payments
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {(['ALL', 'SUCCESS', 'PENDING'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTxnFilter(f)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: txnFilter === f ? '#2e83ff' : '#ffffff',
                    color: txnFilter === f ? '#ffffff' : '#64748b',
                    border: txnFilter === f ? '1px solid #2e83ff' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '3px 8px',
                    fontSize: '10px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
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
            {filteredTxns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#64748b', fontSize: '13px' }}>
                No payments found for this filter.
              </div>
            ) : (
              filteredTxns.map((txn, index) => (
                <React.Fragment key={txn.id}>
                  {index > 0 && <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />}
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
                        {txn.customerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>{txn.customerName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{txn.method} &bull; {txn.time}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="tabular-nums" style={{ fontSize: '14.5px', fontWeight: 800, color: '#10b981' }}>
                        +{formatCurrency(txn.amount)}
                      </div>
                      <span
                        style={{
                          fontSize: '9.5px',
                          fontWeight: 800,
                          color: txn.status === 'SUCCESS' ? '#10b981' : '#f59e0b',
                        }}
                      >
                        {txn.status}
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              ))
            )}
          </div>
        </div>

        {/* Switch back to Customer App & Onboarding link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <SecondaryButton onClick={() => navigateTo('HOME')}>
            Exit to Personal Customer Account
          </SecondaryButton>
          <button
            onClick={() => navigateTo('MERCHANT_ONBOARDING')}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            Update Business Onboarding &amp; KYB Data &rarr;
          </button>
        </div>
      </div>

      {/* Modal 1: Accept Payment (Dynamic Amount & QR / SoftPOS) */}
      <Modal isOpen={isAcceptPaymentModalOpen} onClose={() => setIsAcceptPaymentModalOpen(false)} title="Accept Payment">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '10px 0' }}>
          <div style={{ width: '100%' }}>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', display: 'block', textAlign: 'left' }}>
              Enter Amount to Collect (SAR)
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                backgroundColor: '#f8fafc',
                border: '1.5px solid #2e83ff',
                borderRadius: '12px',
                padding: '12px',
              }}
            >
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#2e83ff' }}>SAR</span>
              <input
                type="number"
                value={acceptAmount}
                onChange={(e) => setAcceptAmount(e.target.value)}
                placeholder="0"
                className="tabular-nums"
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#0f172a',
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  width: '160px',
                  textAlign: 'center',
                }}
              />
            </div>
          </div>

          {/* Quick preset amount chips */}
          <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'center' }}>
            {['50', '100', '250', '500'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAcceptAmount(preset)}
                className="interactive-tap"
                style={{
                  backgroundColor: acceptAmount === preset ? '#eef5ff' : '#ffffff',
                  border: acceptAmount === preset ? '1.5px solid #2e83ff' : '1px solid #cbd5e1',
                  color: acceptAmount === preset ? '#2e83ff' : '#0f172a',
                  borderRadius: '16px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                SAR {preset}
              </button>
            ))}
          </div>

          {/* Dynamic Generated QR Display */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #2e83ff',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <QRCodeView value={dynamicQrPayload} size={160} />
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '10px' }}>
              Scan to Pay {formatCurrency(parseFloat(acceptAmount) || 0)}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              Customer can scan with QTPay or any banking app
            </div>
          </div>

          {paymentReceivedSimulated && (
            <div
              className="fade-in"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10b981',
                borderRadius: '10px',
                padding: '10px',
                color: '#10b981',
                fontWeight: 800,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={16} /> Payment Received Successfully!
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <PrimaryButton onClick={handleSimulateReceivePayment} disabled={paymentReceivedSimulated}>
              Simulate Customer Payment
            </PrimaryButton>
            <SecondaryButton onClick={() => { setIsAcceptPaymentModalOpen(false); navigateTo('SOFTPOS'); }}>
              SoftPOS Tap
            </SecondaryButton>
          </div>
        </div>
      </Modal>

      {/* Modal 2: Store Countertop Standee QR */}
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
              {merchantProfile.tradeName}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '14px' }}>
              Scan &amp; Pay in SAR &bull; Instant Settlement
            </div>

            <QRCodeView value={qrPayload} size={180} />

            <div style={{ marginTop: '14px', fontSize: '12px', fontWeight: 800, color: '#2e83ff' }}>
              {merchantProfile.merchantUpi}
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

      {/* Modal 3: Business Information & Verification */}
      <Modal isOpen={isBusinessInfoModalOpen} onClose={() => setIsBusinessInfoModalOpen(false)} title="Merchant Business Details">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '10px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#eef5ff', border: '1px solid #d6e6ff', padding: '10px 14px', borderRadius: '12px' }}>
            <ShieldCheck size={20} color="#2e83ff" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Verified Commercial Entity</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Ministry of Commerce (MOC) Validated</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12.5px' }}>
              <span style={{ color: '#64748b' }}>Trade Name:</span>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>{merchantProfile.tradeName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12.5px' }}>
              <span style={{ color: '#64748b' }}>Legal Entity:</span>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>{merchantProfile.legalName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12.5px' }}>
              <span style={{ color: '#64748b' }}>CR Number:</span>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>1010892412</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12.5px' }}>
              <span style={{ color: '#64748b' }}>VAT Number:</span>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>310294819200003</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12.5px' }}>
              <span style={{ color: '#64748b' }}>Location:</span>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>{merchantProfile.city}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12.5px' }}>
              <span style={{ color: '#64748b' }}>Settlement Bank:</span>
              <span style={{ fontWeight: 800, color: '#0f172a' }}>{merchantProfile.bankName}</span>
            </div>
          </div>

          <PrimaryButton onClick={() => setIsBusinessInfoModalOpen(false)}>
            Done
          </PrimaryButton>
        </div>
      </Modal>

      {/* Modal 4: Settlement Information & Instant Payout */}
      <Modal isOpen={isSettlementModalOpen} onClose={() => setIsSettlementModalOpen(false)} title="Settlement Account & Status">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '10px 0' }}>
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Landmark size={20} color="#2e83ff" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{merchantProfile.bankName}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{merchantProfile.ibanMasked}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12.5px', borderTop: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Settlement Mode:</span>
              <span style={{ fontWeight: 800, color: '#10b981' }}>Instant Realtime (T+0)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12.5px' }}>
              <span style={{ color: '#64748b' }}>Unsettled Collections:</span>
              <span className="tabular-nums" style={{ fontWeight: 800, color: '#0f172a' }}>{formatCurrency(todayCollections)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '12.5px' }}>
              <span style={{ color: '#64748b' }}>Payout Fee:</span>
              <span style={{ fontWeight: 800, color: '#10b981' }}>SAR 0.00 (Zero Fee)</span>
            </div>
          </div>

          <PrimaryButton onClick={() => { handleInstantPayout(); setIsSettlementModalOpen(false); }} disabled={todayCollections === 0}>
            Instant Transfer to Bank Account
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};
