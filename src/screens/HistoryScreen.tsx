import React, { useState } from 'react';
import { Search, X, Receipt, Share2, FileText } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { TransactionRow } from '../components/TransactionRow';
import { InfoDetailsSheet } from '../components/InfoDetailsSheet';
import { TransactionStatusBadge } from '../components/TransactionStatusBadge';
import { useApp } from '../state/AppContext';
import type { Transaction } from '../types';
import { formatDate } from '../utils/formatters';

type FilterType = 'all' | 'sent' | 'received' | 'pending';

export const HistoryScreen: React.FC = () => {
  const { transactions } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'sent'
        ? t.type === 'sent'
        : filter === 'received'
        ? t.type === 'received'
        : t.type === 'pending';

    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.subTitle && t.subTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.utr.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const groupedByDate: Record<string, typeof transactions> = {};
  filteredTransactions.forEach((t) => {
    const key = t.date || 'TODAY';
    if (!groupedByDate[key]) groupedByDate[key] = [];
    groupedByDate[key].push(t);
  });

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '30px' }}>
      <AppHeader
        title="Transactions"
        showSearch
        onSearchClick={() => setShowSearchInput(!showSearchInput)}
        showSettings
      />

      {showSearchInput && (
        <div style={{ padding: '0 20px', marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #2e83ff',
              borderRadius: '12px',
              padding: '10px 14px',
            }}
          >
            <Search size={16} color="#2e83ff" />
            <input
              type="text"
              placeholder="Search by payee name or UTR number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#0f172a',
                fontSize: '13px',
                fontWeight: 600,
                width: '100%',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter Tabs / Chips */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '0 20px',
          marginBottom: '18px',
          overflowX: 'auto',
        }}
      >
        {(['all', 'sent', 'received', 'pending'] as FilterType[]).map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="interactive-tap"
              style={{
                backgroundColor: isActive ? '#2e83ff' : '#ffffff',
                border: isActive ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                color: isActive ? '#ffffff' : '#475569',
                borderRadius: '20px',
                padding: '7px 16px',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'capitalize',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Grouped Transaction Lists */}
      <div style={{ padding: '0 20px', marginBottom: '24px' }}>
        {Object.keys(groupedByDate).length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '40px 20px',
              color: '#64748b',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              <Receipt size={24} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>No transactions found</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>Try changing search or filter parameters</div>
          </div>
        ) : (
          Object.entries(groupedByDate).map(([dateLabel, items]) => (
            <div key={dateLabel} style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#64748b',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  marginLeft: '4px',
                }}
              >
                {dateLabel}
              </div>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}
              >
                {items.map((txn, index) => (
                  <React.Fragment key={txn.id}>
                    {index > 0 && <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0 16px' }} />}
                    <TransactionRow
                      transaction={txn}
                      onClick={() => setSelectedTxn(txn)}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reusable Transaction Details Sheet */}
      {selectedTxn && (
        <InfoDetailsSheet
          isOpen={Boolean(selectedTxn)}
          onClose={() => setSelectedTxn(null)}
          title={selectedTxn.type === 'received' ? 'Money Received' : 'Payment Paid'}
          subTitle={selectedTxn.subTitle || 'UPI Bank Transfer'}
          badge={<TransactionStatusBadge status={selectedTxn.type === 'pending' ? 'PROCESSING' : 'SUCCESS'} size="sm" />}
          amount={selectedTxn.amount}
          items={[
            { label: 'Payee / Beneficiary', value: selectedTxn.title, isHighlight: true },
            { label: 'Transaction ID', value: selectedTxn.id, isCopyable: true },
            { label: 'UTR / Reference No', value: selectedTxn.utr, isCopyable: true },
            { label: 'Date & Time', value: formatDate(selectedTxn.timestamp) },
            { label: 'Category', value: selectedTxn.category || 'Payment' },
            { label: 'Payment Mode', value: 'ICICI Bank Savings •••• 3616' },
          ]}
          footerNotice="256-Bit Encrypted &bull; NPCI Verified Financial Record"
          primaryAction={{
            label: 'Share Receipt',
            icon: <Share2 size={16} />,
            onClick: () => {
              if (navigator.share) {
                navigator.share({
                  title: 'QTPay Receipt',
                  text: `Payment of ₹${selectedTxn.amount} to ${selectedTxn.title}. UTR: ${selectedTxn.utr}`,
                }).catch(() => {});
              }
            },
          }}
          secondaryAction={{
            label: 'Download Tax Invoice',
            icon: <FileText size={16} />,
            onClick: () => {
              setSelectedTxn(null);
            },
          }}
        />
      )}
    </div>
  );
};
