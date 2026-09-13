import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  RefreshCw,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { useApp } from '../state/AppContext';
import { MockBillerProvider, POPULAR_BILLERS } from '../services/providers/mockAdapters';
import type { BillerInfo, BillFetchResult } from '../types/fintech';
import { formatCurrency } from '../utils/formatters';

const billerProvider = new MockBillerProvider();

export const BillerCodeScreen: React.FC = () => {
  const { openPinModal, completePayment, navigateTo } = useApp();

  const [billerCodeQuery, setBillerCodeQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBiller, setSelectedBiller] = useState<BillerInfo | null>(POPULAR_BILLERS[0]);
  const [consumerNumber, setConsumerNumber] = useState<string>('028540192842');

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchedBill, setFetchedBill] = useState<BillFetchResult | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [customPayAmount, setCustomPayAmount] = useState<string>('');

  const categories = ['All', 'Electricity', 'Gas', 'Water', 'Broadband', 'FASTag'];

  const filteredBillers = POPULAR_BILLERS.filter((b) => {
    const matchCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchQuery = billerCodeQuery
      ? b.billerCode.toLowerCase().includes(billerCodeQuery.toLowerCase()) ||
        b.billerName.toLowerCase().includes(billerCodeQuery.toLowerCase())
      : true;
    return matchCat && matchQuery;
  });

  const handleSelectBiller = (biller: BillerInfo) => {
    setSelectedBiller(biller);
    setFetchedBill(null);
    setFetchError(null);
    // Sample consumer numbers
    if (biller.category === 'Electricity') setConsumerNumber('028540192842');
    else if (biller.category === 'Gas') setConsumerNumber('100098234');
    else if (biller.category === 'Water') setConsumerNumber('1234567890');
    else if (biller.category === 'FASTag') setConsumerNumber('MH02AB1234');
    else setConsumerNumber('9876543210');
  };

  const handleFetchBill = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedBiller) return;

    setFetchError(null);
    setFetchedBill(null);
    setIsFetching(true);

    try {
      const result = await billerProvider.fetchBill(selectedBiller.billerCode, consumerNumber);
      setIsFetching(false);
      if (result.status === 'FAILED') {
        setFetchError(result.errorMessage || 'Bill could not be retrieved. Please check details.');
      } else {
        setFetchedBill(result);
        setCustomPayAmount(result.amountDue.toString());
      }
    } catch {
      setIsFetching(false);
      setFetchError('Network communication error with Bharat BillPay (BBPS). Please retry.');
    }
  };

  const handlePayBill = () => {
    if (!fetchedBill || !selectedBiller) return;
    const amountToPay = parseFloat(customPayAmount) || fetchedBill.amountDue;

    openPinModal({
      title: `${selectedBiller.billerName}`,
      subTitle: `Bill #${fetchedBill.billNumber} (${consumerNumber})`,
      amount: amountToPay,
      onSuccess: () => {
        completePayment({
          title: selectedBiller.billerName,
          subTitle: `BBPS: ${selectedBiller.billerCode} (${consumerNumber})`,
          amount: amountToPay,
          category: 'Bill Payment',
        }).then((txn) => {
          navigateTo('PAYMENT_SUCCESS', { transaction: txn });
        });
      },
    });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '32px' }}>
      <AppHeader title="BBPS Biller Code" showBack />

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top BBPS National Trust Card */}
        <div
          style={{
            backgroundColor: '#071529',
            borderRadius: '16px',
            padding: '16px 18px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(46, 131, 255, 0.25)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
              Bharat Bill Payment System
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>
              Instant bill retrieval & automated settlement receipt
            </div>
          </div>
        </div>

        {/* 1. Biller Search & Selection */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '18px',
          }}
        >
          <label
            htmlFor="biller-search-input"
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
              display: 'block',
            }}
          >
            Search Biller by Code or Name
          </label>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '14px',
            }}
          >
            <Search size={16} color="#64748b" />
            <input
              id="biller-search-input"
              type="text"
              value={billerCodeQuery}
              onChange={(e) => setBillerCodeQuery(e.target.value)}
              placeholder="e.g. MSEB-01, TATA, ADANI"
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0f172a',
                width: '100%',
              }}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '14px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className="interactive-tap"
                style={{
                  backgroundColor: selectedCategory === cat ? '#eef5ff' : '#f8fafc',
                  border: selectedCategory === cat ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                  color: selectedCategory === cat ? '#2e83ff' : '#64748b',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Biller Selection List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
            {filteredBillers.map((biller) => {
              const isSelected = selectedBiller?.billerId === biller.billerId;
              return (
                <div
                  key={biller.billerId}
                  onClick={() => handleSelectBiller(biller)}
                  className="interactive-tap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? '#eef5ff' : '#f8fafc',
                    border: isSelected ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #d6e6ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2e83ff',
                      }}
                    >
                      <Building size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                        {biller.billerName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                        Code: <strong style={{ color: '#2e83ff' }}>{biller.billerCode}</strong> &bull; {biller.category}
                      </div>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 size={18} color="#2e83ff" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Customer Parameter Input Card */}
        {selectedBiller && (
          <form
            onSubmit={handleFetchBill}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '18px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  htmlFor="consumer-input"
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {selectedBiller.accountParamName}
                </label>
                <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                  Demo: ends in 000 for already-paid
                </span>
              </div>

              <input
                id="consumer-input"
                type="text"
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                placeholder={selectedBiller.accountParamPlaceholder}
                required
                style={{
                  width: '100%',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#0f172a',
                  outline: 'none',
                  letterSpacing: '0.04em',
                }}
              />
            </div>

            <PrimaryButton type="submit" disabled={isFetching || !consumerNumber}>
              {isFetching ? (
                <>
                  <RefreshCw size={16} className="spin-slow" /> Fetching Bill from BBPS...
                </>
              ) : (
                <>
                  <FileText size={16} /> Fetch Bill Details
                </>
              )}
            </PrimaryButton>
          </form>
        )}

        {/* Error Feedback */}
        {fetchError && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '14px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#991b1b',
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800 }}>Bill Retrieval Failed</div>
              <div style={{ fontSize: '11.5px', marginTop: '2px' }}>{fetchError}</div>
            </div>
          </div>
        )}

        {/* 3. Fetched Bill Breakdown Card */}
        {fetchedBill && (
          <div
            className="fade-in"
            style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid #2e83ff',
              borderRadius: '18px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#2e83ff', textTransform: 'uppercase' }}>
                  Bill Fetched Successfully
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
                  {fetchedBill.consumerName}
                </h3>
              </div>

              {fetchedBill.isAlreadyPaid ? (
                <span style={{ backgroundColor: '#d1fae5', color: '#065f46', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '10px' }}>
                  ZERO DUES
                </span>
              ) : (
                <span style={{ backgroundColor: '#eef5ff', color: '#2e83ff', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '10px', border: '1px solid #d6e6ff' }}>
                  PAYMENT DUE
                </span>
              )}
            </div>

            {/* Bill Info Grid */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Bill Number</span>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{fetchedBill.billNumber}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Billing Cycle</span>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{fetchedBill.billPeriod}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Due Date</span>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{fetchedBill.dueDate}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Late Fee After Due</span>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#ef4444' }}>+{formatCurrency(fetchedBill.lateFee)}</div>
              </div>
            </div>

            {/* Amount Due Big Display */}
            <div
              style={{
                backgroundColor: '#eef5ff',
                border: '1px solid #d6e6ff',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Total Payable Amount
              </span>
              <div className="tabular-nums" style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                {formatCurrency(fetchedBill.amountDue)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11.5px', color: '#64748b' }}>
                <Clock size={12} /> Due by {fetchedBill.dueDate}
              </div>
            </div>

            {/* Partial Payment Toggle if supported */}
            {selectedBiller?.supportsPartialPay && !fetchedBill.isAlreadyPaid && (
              <div>
                <label
                  htmlFor="partial-amt-input"
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                    display: 'block',
                  }}
                >
                  Custom Payment Amount (SAR)
                </label>
                <input
                  id="partial-amt-input"
                  type="number"
                  value={customPayAmount}
                  onChange={(e) => setCustomPayAmount(e.target.value)}
                  className="tabular-nums"
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #2e83ff',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#0f172a',
                    outline: 'none',
                  }}
                />
              </div>
            )}

            {/* Pay Button or Zero Due message */}
            {fetchedBill.isAlreadyPaid ? (
              <div style={{ textAlign: 'center', padding: '10px', color: '#065f46', fontSize: '13px', fontWeight: 700 }}>
                ✓ No payment is needed at this time.
              </div>
            ) : (
              <PrimaryButton onClick={handlePayBill}>
                Authorize & Pay {formatCurrency(parseFloat(customPayAmount) || fetchedBill.amountDue)} <ArrowRight size={18} />
              </PrimaryButton>
            )}
          </div>
        )}

        {/* Return to All Services */}
        <div style={{ marginTop: '8px' }}>
          <SecondaryButton onClick={() => navigateTo('ALL_SERVICES')}>
            View All Services Catalog
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};
