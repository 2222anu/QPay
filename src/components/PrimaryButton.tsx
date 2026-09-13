import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
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
        backgroundColor: disabled ? '#cbd5e1' : '#2e83ff',
        color: disabled ? '#64748b' : '#ffffff',
        border: 'none',
        borderRadius: '10px',
        padding: '14px 20px',
        minHeight: '48px',
        fontSize: '15px',
        fontWeight: 800,
        letterSpacing: '0.01em',
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
