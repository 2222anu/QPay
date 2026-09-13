import { MockSoftPosProvider } from './providers/mockAdapters';
import type { SoftPosSession } from '../types/fintech';

const softPosProvider = new MockSoftPosProvider();

export const softPosService = {
  async checkDeviceEligibility(): Promise<{
    eligible: boolean;
    nfcAvailable: boolean;
    securityAttested: boolean;
    terminalId: string;
  }> {
    return softPosProvider.checkDeviceEligibility();
  },

  async startTapSession(terminalId: string, amount: number): Promise<SoftPosSession> {
    return softPosProvider.startTapToPay(terminalId, amount);
  },

  async simulateCardTap(amount: number): Promise<{
    status: 'APPROVED' | 'DECLINED' | 'TIMEOUT';
    cardBrand: string;
    maskedCard: string;
    authCode?: string;
    referenceId?: string;
    errorMessage?: string;
  }> {
    // Simulate EMV contactless reading & authorization
    await new Promise((resolve) => setTimeout(resolve, 900));

    // Demo: amounts ending in 999 decline
    if (amount === 999) {
      return {
        status: 'DECLINED',
        cardBrand: 'Visa Contactless',
        maskedCard: '•••• •••• •••• 4012',
        errorMessage: 'Transaction declined by issuing bank (Insufficient funds / Limit exceeded).',
      };
    }

    return {
      status: 'APPROVED',
      cardBrand: 'RuPay Contactless',
      maskedCard: '•••• •••• •••• 9901',
      authCode: `AUTH${Math.floor(100000 + Math.random() * 900000)}`,
      referenceId: `REF${Date.now().toString().slice(-8)}`,
    };
  },
};
