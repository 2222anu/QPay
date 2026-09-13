import React, { useState } from 'react';
import {
  Bell,
  Camera,
  Send,
  FileText,
  Zap,
  Smartphone,
  Tv,
  Car,
  ChevronRight,
  Landmark,
  CreditCard,
  Store,
  QrCode,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { QPayHeroBanner } from '../components/QPayHeroBanner';
import { PWAInstallPrompt } from '../components/PWAInstallPrompt';
import { BankCardCarousel } from '../components/BankCardCarousel';
import { BalanceSummaryModal } from '../components/BalanceSummaryModal';
import { TransactionRow } from '../components/TransactionRow';
import { useApp } from '../state/AppContext';

export const HomeScreen: React.FC = () => {
  const { bankAccounts, transactions, navigateTo, setIsScanModalOpen, openPinModal } = useApp();
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);

  const totalBalance = bankAccounts.reduce((acc, bank) => acc + bank.balance, 0);
  const recentTransactions = transactions.slice(0, 3);

  const handleCheckBalanceClick = () => {
    openPinModal({
      title: 'Check Bank Balance',
      subTitle: 'Enter 4-digit UPI PIN to view account balance',
      amount: totalBalance,
      onSuccess: () => {
        setIsBalanceModalOpen(true);
      },
    });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '20px' }}>
      {/* 1. White Header with Centered Official Logo */}
      <AppHeader
        showUserInfo
        showSettings={false}
        rightAction={
          <button
            onClick={() => navigateTo('NOTIFICATIONS')}
            aria-label="Notifications"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: 'none',
              color: '#0f172a',
            }}
          >
            <Bell size={18} color="#0f172a" />
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#2e83ff',
              }}
            />
          </button>
        }
      />

      {/* Promotional Hero Banner */}
      <QPayHeroBanner />

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* My Bank Accounts Carousel */}
      {bankAccounts.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <BankCardCarousel banks={bankAccounts} />
        </div>
      )}

      {/* 4. Quick Actions Container Card */}
      <div
        style={{
          margin: '0 clamp(12px, 3.5vw, 20px) 16px clamp(12px, 3.5vw, 20px)',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '20px clamp(12px, 3.5vw, 18px)',
          boxShadow: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.01em', margin: 0 }}>
            Transfer & Pay
          </h3>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#2e83ff', backgroundColor: '#eef5ff', padding: '2px 8px', borderRadius: '10px', border: '1px solid #d6e6ff' }}>
            Instant UPI
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '8px' }}>
          {/* Scan & Pay */}
          <div
            onClick={() => setIsScanModalOpen(true)}
            className="interactive-tap"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                border: '1px solid #d6e6ff',
              }}
            >
              <Camera size={22} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', textAlign: 'center', letterSpacing: '-0.01em' }}>
              Scan & Pay
            </span>
          </div>

          {/* Send Money */}
          <div
            onClick={() => navigateTo('PAY_ANYONE')}
            className="interactive-tap"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                border: '1px solid #d6e6ff',
              }}
            >
              <Send size={22} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', textAlign: 'center', letterSpacing: '-0.01em' }}>
              Send Money
            </span>
          </div>

          {/* Check Balance */}
          <div
            onClick={handleCheckBalanceClick}
            className="interactive-tap"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                border: '1px solid #d6e6ff',
              }}
            >
              <Landmark size={22} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', textAlign: 'center', letterSpacing: '-0.01em' }}>
              Check Balance
            </span>
          </div>

          {/* Pay Bills */}
          <div
            onClick={() => navigateTo('ALL_SERVICES')}
            className="interactive-tap"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                border: '1px solid #d6e6ff',
              }}
            >
              <FileText size={22} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', textAlign: 'center', letterSpacing: '-0.01em' }}>
              Pay Bills
            </span>
          </div>
        </div>
      </div>

      {/* 5. BBPS Services Container Card */}
      <div
        style={{
          margin: '0 clamp(12px, 3.5vw, 20px) 16px clamp(12px, 3.5vw, 20px)',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '20px clamp(12px, 3.5vw, 18px)',
          boxShadow: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.01em', margin: 0 }}>
            Recharge & Utilities
          </h3>
          <button
            onClick={() => navigateTo('ALL_SERVICES')}
            className="interactive-tap"
            style={{
              backgroundColor: '#eef5ff',
              border: '1px solid #d6e6ff',
              borderRadius: '8px',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: '800',
              color: '#2e83ff',
              cursor: 'pointer',
              boxShadow: 'none',
            }}
          >
            View All
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '8px' }}>
          {/* Electricity */}
          <div
            onClick={() => navigateTo('ELECTRICITY')}
            className="interactive-tap"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                border: '1px solid #d6e6ff',
              }}
            >
              <Zap size={22} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', textAlign: 'center' }}>
              Electricity
            </span>
          </div>

          {/* Mobile */}
          <div
            onClick={() => navigateTo('ALL_SERVICES')}
            className="interactive-tap"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                border: '1px solid #d6e6ff',
              }}
            >
              <Smartphone size={22} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', textAlign: 'center' }}>
              Mobile
            </span>
          </div>

          {/* DTH */}
          <div
            onClick={() => navigateTo('ALL_SERVICES')}
            className="interactive-tap"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                border: '1px solid #d6e6ff',
              }}
            >
              <Tv size={22} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', textAlign: 'center' }}>
              DTH
            </span>
          </div>

          {/* FASTag */}
          <div
            onClick={() => navigateTo('ALL_SERVICES')}
            className="interactive-tap"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                border: '1px solid #d6e6ff',
              }}
            >
              <Car size={22} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', textAlign: 'center' }}>
              FASTag
            </span>
          </div>
        </div>
      </div>

      {/* 5b. Fintech Hub: Cards & Merchant Suite */}
      <div
        style={{
          margin: '0 clamp(12px, 3.5vw, 20px) 16px clamp(12px, 3.5vw, 20px)',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '18px clamp(12px, 3.5vw, 18px)',
          boxShadow: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.01em', margin: 0 }}>
            Cards & Business Hub
          </h3>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#2e83ff', backgroundColor: '#eef5ff', padding: '2px 8px', borderRadius: '10px', border: '1px solid #d6e6ff' }}>
            Fintech Suite
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {/* Cards Hub */}
          <div
            onClick={() => navigateTo('CARDS')}
            className="interactive-tap"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 6px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                border: '1px solid #d6e6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CreditCard size={20} />
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f172a' }}>Cards Hub</span>
            <span style={{ fontSize: '9.5px', color: '#64748b' }}>Virtual & Limits</span>
          </div>

          {/* Merchant Hub */}
          <div
            onClick={() => navigateTo('MERCHANT_DASHBOARD')}
            className="interactive-tap"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 6px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                border: '1px solid #d6e6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Store size={20} />
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f172a' }}>Merchant</span>
            <span style={{ fontSize: '9.5px', color: '#64748b' }}>SoftPOS & SoundBox</span>
          </div>

          {/* BBPS Biller Code */}
          <div
            onClick={() => navigateTo('BILLER_CODE')}
            className="interactive-tap"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 6px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                border: '1px solid #d6e6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QrCode size={20} />
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f172a' }}>BBPS Code</span>
            <span style={{ fontSize: '9.5px', color: '#64748b' }}>Instant Fetch</span>
          </div>
        </div>
      </div>

      {/* 6. Recent Transactions Section */}
      <div style={{ padding: '0 clamp(12px, 3.5vw, 20px)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>Recent Activity</h3>
          <button
            onClick={() => navigateTo('HISTORY')}
            style={{
              background: 'none',
              border: 'none',
              color: '#2e83ff',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              boxShadow: 'none',
            }}
          >
            View All <ChevronRight size={14} />
          </button>
        </div>

        {recentTransactions.map((txn) => (
          <TransactionRow key={txn.id} transaction={txn} onClick={() => navigateTo('HISTORY')} />
        ))}
      </div>

      {/* Verified UPI Balance Modal Sheet */}
      <BalanceSummaryModal
        isOpen={isBalanceModalOpen}
        onClose={() => setIsBalanceModalOpen(false)}
        bankAccounts={bankAccounts}
        totalBalance={totalBalance}
        onManageAccounts={() => navigateTo('BANK_ACCOUNTS')}
      />
    </div>
  );
};
