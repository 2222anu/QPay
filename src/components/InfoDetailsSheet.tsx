import React, { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { Copy, Check, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export interface DetailRowItem {
  label: string;
  value: string;
  isCopyable?: boolean;
  isHighlight?: boolean;
  note?: string;
}

export interface InfoDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subTitle?: string;
  badge?: React.ReactNode;
  amount?: number;
  items: DetailRowItem[];
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  footerNotice?: string;
}

export const InfoDetailsSheet: React.FC<InfoDetailsSheetProps> = ({
  isOpen,
  onClose,
  title,
  subTitle,
  badge,
  amount,
  items,
  primaryAction,
  secondaryAction,
  footerNotice,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '8px' }}>
        {/* Header Block with Subtitle and Badge */}
        {(subTitle || badge) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-8px' }}>
            {subTitle && (
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{subTitle}</span>
            )}
            {badge && <div>{badge}</div>}
          </div>
        )}

        {/* Large Amount Display if provided */}
        {amount !== undefined && (
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              Transaction Amount
            </div>
            <div
              className="tabular-nums"
              style={{
                fontSize: '28px',
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              {formatCurrency(amount)}
            </div>
          </div>
        )}

        {/* Breakdown Items List */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            const isCopied = copiedKey === item.label;

            return (
              <React.Fragment key={item.label}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    backgroundColor: item.isHighlight ? '#f8fafc' : '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                      {item.label}
                    </span>
                    {item.note && (
                      <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 500 }}>
                        {item.note}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      className="tabular-nums"
                      style={{
                        fontSize: '13.5px',
                        fontWeight: item.isHighlight ? 800 : 700,
                        color: item.isHighlight ? '#2e83ff' : '#0f172a',
                        textAlign: 'right',
                        maxWidth: '220px',
                        wordBreak: 'break-word',
                      }}
                    >
                      {item.value}
                    </span>

                    {item.isCopyable && (
                      <button
                        type="button"
                        onClick={() => handleCopy(item.value, item.label)}
                        aria-label={`Copy ${item.label}`}
                        className="interactive-tap"
                        style={{
                          background: isCopied ? '#eef5ff' : '#f8fafc',
                          border: `1px solid ${isCopied ? '#d6e6ff' : '#cbd5e1'}`,
                          color: isCopied ? '#2e83ff' : '#64748b',
                          borderRadius: '6px',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {isCopied ? <Check size={12} color="#2e83ff" /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>
                </div>
                {!isLast && <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0 16px' }} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer Notice */}
        {footerNotice && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', fontWeight: 600, padding: '0 4px' }}>
            <ShieldCheck size={13} color="#2e83ff" />
            <span>{footerNotice}</span>
          </div>
        )}

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
            {primaryAction && (
              <PrimaryButton onClick={primaryAction.onClick}>
                {primaryAction.icon} {primaryAction.label}
              </PrimaryButton>
            )}
            {secondaryAction && (
              <SecondaryButton onClick={secondaryAction.onClick}>
                {secondaryAction.icon} {secondaryAction.label}
              </SecondaryButton>
            )}
          </div>
        )}
      </div>
    </BottomSheet>
  );
};
