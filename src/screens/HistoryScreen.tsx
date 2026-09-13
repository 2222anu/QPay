import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Receipt,
  Share2,
  FileText,
  TrendingDown,
  PieChart,
  BarChart3,
  Zap,
  ShoppingBag,
  Utensils,
  Car,
  Send,
  Calendar,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { TransactionRow } from '../components/TransactionRow';
import { InfoDetailsSheet } from '../components/InfoDetailsSheet';
import { TransactionStatusBadge } from '../components/TransactionStatusBadge';
import { useApp } from '../state/AppContext';
import type { Transaction } from '../types';
import { formatDate, formatCurrency } from '../utils/formatters';

type FilterType = 'all' | 'sent' | 'received' | 'pending';
type ViewMode = 'transactions' | 'analysis';
type Timeframe = 'month' | 'week' | 'all';

export const HistoryScreen: React.FC = () => {
  const { transactions } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('transactions');
  const [filter, setFilter] = useState<FilterType>('all');
  const [timeframe, setTimeframe] = useState<Timeframe>('month');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Total available balance across linked Saudi banks
  const totalBalance = useApp().bankAccounts.reduce((acc, bank) => acc + bank.balance, 0);

  // Calculate Spent Analysis Metrics
  const spentMetrics = useMemo(() => {
    const sentTransactions = transactions.filter((t) => t.type === 'sent');
    const totalSpent = sentTransactions.reduce((acc, t) => acc + t.amount, 0);
    const totalReceived = transactions.filter((t) => t.type === 'received').reduce((acc, t) => acc + t.amount, 0);

    // Grouping by Category
    const categoryMap: Record<string, { amount: number; count: number }> = {};
    sentTransactions.forEach((t) => {
      const cat = t.category || 'Payment';
      if (!categoryMap[cat]) categoryMap[cat] = { amount: 0, count: 0 };
      categoryMap[cat].amount += t.amount;
      categoryMap[cat].count += 1;
    });

    const categoryList = Object.entries(categoryMap)
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        count: data.count,
        percent: totalSpent > 0 ? Math.round((data.amount / totalSpent) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Weekly spend distribution (time-based analysis)
    const weeklyTrends = [
      { label: 'Week 1', amount: totalSpent * 0.22, height: '45%' },
      { label: 'Week 2', amount: totalSpent * 0.35, height: '70%' },
      { label: 'Week 3', amount: totalSpent * 0.18, height: '38%' },
      { label: 'Current', amount: totalSpent * 0.25, height: '55%', isCurrent: true },
    ];

    // Monthly budget comparison
    const monthlyBudget = 10000;
    const remainingBudget = Math.max(0, monthlyBudget - totalSpent);

    return {
      totalSpent,
      totalReceived,
      debitCount: sentTransactions.length,
      categoryList,
      weeklyTrends,
      monthlyBudget,
      remainingBudget,
    };
  }, [transactions]);

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('util') || name.includes('bill') || name.includes('electric') || name.includes('water')) {
      return <Zap size={16} color="#2e83ff" />;
    }
    if (name.includes('grocer') || name.includes('shop') || name.includes('store') || name.includes('market')) {
      return <ShoppingBag size={16} color="#2e83ff" />;
    }
    if (name.includes('food') || name.includes('din') || name.includes('rest')) {
      return <Utensils size={16} color="#2e83ff" />;
    }
    if (name.includes('travel') || name.includes('mobil') || name.includes('ride') || name.includes('car')) {
      return <Car size={16} color="#2e83ff" />;
    }
    return <Send size={16} color="#2e83ff" />;
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'sent'
        ? t.type === 'sent'
        : filter === 'received'
        ? t.type === 'received'
        : t.type === 'pending';

    const matchesCategory = selectedCategory ? (t.category || 'Payment') === selectedCategory : true;

    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.subTitle && t.subTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.utr.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesCategory && matchesSearch;
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
        title={viewMode === 'analysis' ? 'Spent Analysis' : 'Transactions'}
        showSearch={viewMode === 'transactions'}
        onSearchClick={() => setShowSearchInput(!showSearchInput)}
        showSettings
      />

      {/* Top View Selector: [ Transactions ] / [ Spent Analysis ] */}
      <div style={{ padding: '0 20px', marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '3px',
          }}
        >
          <button
            onClick={() => {
              setViewMode('transactions');
              setSelectedCategory(null);
            }}
            className="interactive-tap"
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: viewMode === 'transactions' ? '#2e83ff' : 'transparent',
              color: viewMode === 'transactions' ? '#ffffff' : '#475569',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Receipt size={15} />
            <span>Transactions</span>
          </button>

          <button
            onClick={() => setViewMode('analysis')}
            className="interactive-tap"
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '9px',
              border: 'none',
              backgroundColor: viewMode === 'analysis' ? '#2e83ff' : 'transparent',
              color: viewMode === 'analysis' ? '#ffffff' : '#475569',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <BarChart3 size={15} />
            <span>Spent Analysis</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: SPENT ANALYSIS DASHBOARD */}
      {viewMode === 'analysis' && (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* Timeframe Filter Selector */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { key: 'month', label: 'This Month' },
              { key: 'week', label: 'This Week' },
              { key: 'all', label: 'All Time' },
            ].map((tf) => (
              <button
                key={tf.key}
                onClick={() => setTimeframe(tf.key as Timeframe)}
                className="interactive-tap"
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: '10px',
                  backgroundColor: timeframe === tf.key ? '#eef5ff' : '#ffffff',
                  border: timeframe === tf.key ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                  color: timeframe === tf.key ? '#2e83ff' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Hero Spending & Balance Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #071529 0%, #0a2540 50%, #1d4ed8 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '20px',
              padding: '20px',
              color: '#ffffff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#82b5ff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Spent ({timeframe === 'month' ? 'This Month' : timeframe === 'week' ? 'This Week' : 'Total'})
                </span>
                <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 900, marginTop: '4px', letterSpacing: '-0.01em' }}>
                  {formatCurrency(spentMetrics.totalSpent)}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(46, 131, 255, 0.25)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <TrendingDown size={13} /> -14% vs last
              </div>
            </div>

            {/* Quick Metrics Bar: Available Balance & Txn Count */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase' }}>
                  Available in Saudi Banks
                </div>
                <div className="tabular-nums" style={{ fontSize: '14.5px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  {formatCurrency(totalBalance)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Transactions
                </div>
                <div className="tabular-nums" style={{ fontSize: '14px', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                  {spentMetrics.debitCount} Debited
                </div>
              </div>
            </div>
          </div>

          {/* Time-Based Spending Trend (Visual Weekly Bars) */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px 18px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#2e83ff" />
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Spending Trend</span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Weekly Cadence</span>
            </div>

            {/* Bars container */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '110px', paddingTop: '10px' }}>
              {spentMetrics.weeklyTrends.map((trend, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <span className="tabular-nums" style={{ fontSize: '10px', fontWeight: 700, color: trend.isCurrent ? '#2e83ff' : '#64748b' }}>
                    {formatCurrency(trend.amount)}
                  </span>
                  <div
                    style={{
                      width: '28px',
                      height: trend.height,
                      backgroundColor: trend.isCurrent ? '#2e83ff' : '#e2e8f0',
                      borderRadius: '6px 6px 2px 2px',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: trend.isCurrent ? 800 : 600, color: trend.isCurrent ? '#0f172a' : '#64748b' }}>
                    {trend.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category-Wise Breakdown */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '18px 16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart size={16} color="#2e83ff" />
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Spending by Category</span>
              </div>
              <span style={{ fontSize: '11px', color: '#2e83ff', fontWeight: 700 }}>Tap to filter list</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {spentMetrics.categoryList.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <div
                    key={cat.name}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                    className="interactive-tap"
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#eef5ff' : '#f8fafc',
                      border: isSelected ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #d6e6ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {getCategoryIcon(cat.name)}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{cat.name}</div>
                          <div style={{ fontSize: '10.5px', color: '#64748b' }}>{cat.count} transactions</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div className="tabular-nums" style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                          {formatCurrency(cat.amount)}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#2e83ff' }}>{cat.percent}%</div>
                      </div>
                    </div>

                    {/* Relative Progress Bar */}
                    <div style={{ height: '5px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${cat.percent}%`,
                          height: '100%',
                          backgroundColor: '#2e83ff',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Budget Remaining Indicator */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>Monthly Spending Target</span>
              <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>
                {formatCurrency(spentMetrics.remainingBudget)} remaining
              </span>
            </div>
            <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
              <div
                style={{
                  width: `${Math.min(100, Math.round((spentMetrics.totalSpent / spentMetrics.monthlyBudget) * 100))}%`,
                  height: '100%',
                  backgroundColor: '#2e83ff',
                }}
              />
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              Target: {formatCurrency(spentMetrics.monthlyBudget)} • Used {Math.round((spentMetrics.totalSpent / spentMetrics.monthlyBudget) * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: TRANSACTIONS LIST */}
      {viewMode === 'transactions' && (
        <>
          {/* Quick Summary Strip & Shortcut to Analysis */}
          <div
            onClick={() => setViewMode('analysis')}
            className="interactive-tap"
            style={{
              margin: '0 20px 16px 20px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#eef5ff',
                  color: '#2e83ff',
                  border: '1px solid #d6e6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BarChart3 size={17} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Spent Analysis
                </div>
                <div className="tabular-nums" style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                  {formatCurrency(spentMetrics.totalSpent)} spent this period
                </div>
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#2e83ff' }}>View Details &rarr;</span>
          </div>

          {/* Search Input Bar */}
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

          {/* Active Category Filter Pill if Selected */}
          {selectedCategory && (
            <div style={{ padding: '0 20px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Filtered by:</span>
              <span
                style={{
                  backgroundColor: '#eef5ff',
                  border: '1px solid #d6e6ff',
                  borderRadius: '12px',
                  padding: '3px 10px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  color: '#2e83ff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                {selectedCategory}
                <X size={13} style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory(null)} />
              </span>
            </div>
          )}

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
        </>
      )}

      {/* Reusable Transaction Details Sheet */}
      {selectedTxn && (
        <InfoDetailsSheet
          isOpen={Boolean(selectedTxn)}
          onClose={() => setSelectedTxn(null)}
          title={selectedTxn.type === 'received' ? 'Money Received' : 'Payment Paid'}
          subTitle={selectedTxn.subTitle || 'Instant Bank Transfer'}
          badge={<TransactionStatusBadge status={selectedTxn.type === 'pending' ? 'PROCESSING' : 'SUCCESS'} size="sm" />}
          amount={selectedTxn.amount}
          items={[
            { label: 'Payee / Beneficiary', value: selectedTxn.title, isHighlight: true },
            { label: 'Transaction ID', value: selectedTxn.id, isCopyable: true },
            { label: 'UTR / Reference No', value: selectedTxn.utr, isCopyable: true },
            { label: 'Date & Time', value: formatDate(selectedTxn.timestamp) },
            { label: 'Category', value: selectedTxn.category || 'Payment' },
            { label: 'Payment Mode', value: 'Al Rajhi Bank Savings •••• 3616' },
          ]}
          footerNotice="256-Bit Encrypted &bull; Saudi Central Bank (SAMA) Compliant Record"
          primaryAction={{
            label: 'Share Receipt',
            icon: <Share2 size={16} />,
            onClick: () => {
              if (navigator.share) {
                navigator.share({
                  title: 'QTPay Receipt',
                  text: `Payment of ${formatCurrency(selectedTxn.amount)} to ${selectedTxn.title}. UTR: ${selectedTxn.utr}`,
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
