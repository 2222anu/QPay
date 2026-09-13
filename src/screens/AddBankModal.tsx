import React, { useState } from 'react';
import { Landmark, Check } from 'lucide-react';
import { BottomSheet } from '../components/BottomSheet';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../state/AppContext';

export const AddBankModal: React.FC = () => {
  const { isAddBankModalOpen, setIsAddBankModalOpen, addBankAccount } = useApp();
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const availableBanks = [
    { name: 'State Bank of India', code: 'SBI' },
    { name: 'HDFC Bank', code: 'HDFC' },
    { name: 'ICICI Bank', code: 'ICICI' },
    { name: 'Axis Bank', code: 'AXIS' },
    { name: 'Kotak Mahindra Bank', code: 'KOTAK' },
    { name: 'Yes Bank', code: 'YES' },
  ];

  const handleAdd = async () => {
    setIsLoading(true);
    await addBankAccount(selectedBank);
    setIsLoading(false);
    setIsAddBankModalOpen(false);
  };

  return (
    <BottomSheet
      isOpen={isAddBankModalOpen}
      onClose={() => setIsAddBankModalOpen(false)}
      title="Link Bank Account"
      themeMode="light"
    >
      <div style={{ marginBottom: '24px' }}>
        <div role="radiogroup" aria-label="Available Banks" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {availableBanks.map((bank) => {
            const isSelected = selectedBank === bank.name;
            return (
              <div
                key={bank.name}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => setSelectedBank(bank.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedBank(bank.name);
                  }
                }}
                className="interactive-tap"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 16px',
                  backgroundColor: isSelected ? '#eef5ff' : '#ffffff',
                  border: isSelected ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? '#ffffff' : '#f8fafc',
                      color: isSelected ? '#2e83ff' : '#64748b',
                      border: `1px solid ${isSelected ? '#d6e6ff' : '#e2e8f0'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '11px',
                    }}
                  >
                    <Landmark size={18} />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
                    {bank.name}
                  </span>
                </div>

                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: isSelected ? 'none' : '1.5px solid #cbd5e1',
                    backgroundColor: isSelected ? '#2e83ff' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isSelected && <Check size={13} color="#ffffff" strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PrimaryButton onClick={handleAdd} disabled={isLoading}>
        {isLoading ? 'Verifying & Linking...' : `Link ${selectedBank}`}
      </PrimaryButton>
    </BottomSheet>
  );
};
