import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  fullWidth = true,
  className = '',
  disabled,
  style,
  ...props
}) => {
  return (
    <button
      className={`interactive-tap ${className}`}
      style={{
        width: fullWidth ? '100%' : 'auto',
        backgroundColor: '#ffffff',
        color: disabled ? '#94a3b8' : '#0f172a',
        border: '1.5px solid #cbd5e1',
        borderRadius: '10px',
        padding: '13px 20px',
        minHeight: '48px',
        fontSize: '15px',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: 'none',
        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        userSelect: 'none',
        ...style,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
