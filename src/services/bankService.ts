import type { BankAccount } from '../types';

const INITIAL_BANKS: BankAccount[] = [
  {
    id: 'bank-1',
    bankName: 'Al Rajhi Bank',
    accountType: 'Savings Account',
    accountNumberMasked: '**** 3616',
    isPrimary: true,
    balance: 84520.5,
    showBalance: false,
  },
  {
    id: 'bank-2',
    bankName: 'Saudi National Bank (SNB)',
    accountType: 'Savings Account',
    accountNumberMasked: '**** 8821',
    isPrimary: false,
    balance: 14200.0,
    showBalance: false,
  },
  {
    id: 'bank-3',
    bankName: 'Riyad Bank',
    accountType: 'Current Account',
    accountNumberMasked: '**** 5590',
    isPrimary: false,
    balance: 32910.75,
    showBalance: false,
  },
];

export const bankService = {
  async getBankAccounts(): Promise<BankAccount[]> {
    return [...INITIAL_BANKS];
  },

  async addBankAccount(bankName: string): Promise<BankAccount> {
    const maskedAcc = '**** ' + Math.floor(1000 + Math.random() * 9000).toString();
    return {
      id: `bank-${Date.now()}`,
      bankName,
      accountType: 'Savings Account',
      accountNumberMasked: maskedAcc,
      isPrimary: false,
      balance: Math.floor(5000 + Math.random() * 45000),
      showBalance: false,
    };
  },
};
