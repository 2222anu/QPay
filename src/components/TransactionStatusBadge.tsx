import React from 'react';
import { CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import type { TransactionStatus } from '../types/fintech';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  size?: 'sm' | 'md';
}

export const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const isSm = size === 'sm';

  const config: Record<
    TransactionStatus,
    { label: string; bg: string; border: string; text: string; icon: React.ReactNode }
  > = {
    SUCCESS: {
      label: 'Success',
      bg: '#eef5ff',
      border: '#d6e6ff',
      text: '#2e83ff',
      icon: <CheckCircle2 size={isSm ? 12 : 14} />,
    },
    PROCESSING: {
      label: 'Processing',
      bg: '#eef5ff',
      border: '#d6e6ff',
      text: '#2e83ff',
      icon: <RefreshCw size={isSm ? 12 : 14} className="spin-slow" />,
    },
    AUTHENTICATION_REQUIRED: {
      label: 'PIN Required',
      bg: '#f8fafc',
      border: '#cbd5e1',
      text: '#475569',
      icon: <Clock size={isSm ? 12 : 14} />,
    },
    VALIDATING: {
      label: 'Validating',
      bg: '#eef5ff',
      border: '#d6e6ff',
      text: '#2e83ff',
      icon: <RefreshCw size={isSm ? 12 : 14} className="spin-slow" />,
    },
    INITIATED: {
      label: 'Initiated',
      bg: '#f8fafc',
      border: '#e2e8f0',
      text: '#64748b',
      icon: <Clock size={isSm ? 12 : 14} />,
    },
    TIMEOUT: {
      label: 'Pending Confirmation',
      bg: '#f8fafc',
      border: '#cbd5e1',
      text: '#475569',
      icon: <Clock size={isSm ? 12 : 14} />,
    },
    FAILED: {
      label: 'Failed',
      bg: '#fee2e2',
      border: '#fca5a5',
      text: '#991b1b',
      icon: <AlertCircle size={isSm ? 12 : 14} />,
    },
  };

  const item = config[status] || config.SUCCESS;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSm ? '4px' : '6px',
        backgroundColor: item.bg,
        border: `1px solid ${item.border}`,
        color: item.text,
        borderRadius: isSm ? '6px' : '8px',
        padding: isSm ? '2px 8px' : '4px 10px',
        fontSize: isSm ? '11px' : '12px',
        fontWeight: 700,
        letterSpacing: '0.02em',
      }}
    >
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
};
