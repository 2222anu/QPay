import React from 'react';

interface ServiceCardProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: string;
  bgColor?: string;
  iconBg?: string;
  iconColor?: string;
  borderColor?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  label,
  icon,
  onClick,
  badge,
  bgColor = '#ffffff',
  iconBg = '#eef5ff',
  iconColor = '#2e83ff',
  borderColor = '#e2e8f0',
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-label={label}
      className="interactive-tap"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 6px',
        minHeight: '80px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        cursor: 'pointer',
        position: 'relative',
        transition: 'border-color 0.2s ease, transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        textAlign: 'center',
        boxShadow: 'none',
        userSelect: 'none',
      }}
    >
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: '-7px',
            right: '6px',
            fontSize: '9px',
            fontWeight: 800,
            backgroundColor: '#2e83ff',
            color: '#ffffff',
            padding: '2px 7px',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {badge}
        </span>
      )}
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          backgroundColor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
          marginBottom: '8px',
          border: '1px solid #d6e6ff',
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#0f172a',
          lineHeight: '13.5px',
          letterSpacing: '-0.01em',
          wordBreak: 'keep-all',
          maxWidth: '100%',
          display: 'block',
        }}
      >
        {label}
      </span>
    </div>
  );
};
