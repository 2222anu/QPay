import { MockQRProvider } from './providers/mockAdapters';
import type { DecodedQRData } from '../types/fintech';
import type { Transaction } from '../types';

const qrProvider = new MockQRProvider();

export const qrService = {
  getUpiQrString(upiId: string, name: string, amount?: number, note?: string): string {
    let url = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&cu=INR`;
    if (amount && amount > 0) {
      url += `&am=${amount}`;
    }
    if (note) {
      url += `&tn=${encodeURIComponent(note)}`;
    }
    return url;
  },

  async decodeQR(payload: string): Promise<DecodedQRData> {
    return qrProvider.decodeQR(payload);
  },

  async validateRecipient(vpa: string): Promise<{ isValid: boolean; recipientName: string; isMerchant: boolean }> {
    return qrProvider.validateRecipient(vpa);
  },

  checkDuplicateTransaction(
    payeeNameOrVpa: string,
    amount: number,
    recentTransactions: Transaction[]
  ): { isDuplicate: boolean; lastTxnTime?: string } {
    const now = Date.now();
    const thresholdMs = 60 * 1000; // 60 seconds

    const match = recentTransactions.find((txn) => {
      const timeDiff = now - new Date(txn.timestamp).getTime();
      const sameAmount = Math.abs(txn.amount - amount) < 0.01;
      const samePayee =
        txn.title.toLowerCase() === payeeNameOrVpa.toLowerCase() ||
        (txn.subTitle && txn.subTitle.toLowerCase().includes(payeeNameOrVpa.toLowerCase()));
      return sameAmount && samePayee && timeDiff < thresholdMs;
    });

    if (match) {
      return {
        isDuplicate: true,
        lastTxnTime: 'less than a minute ago',
      };
    }

    return { isDuplicate: false };
  },
};
