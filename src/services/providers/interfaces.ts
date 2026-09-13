import type {
  FintechTransaction,
  DecodedQRData,
  BillerInfo,
  BillFetchResult,
  QTPayCard,
  SoftPosSession,
  SoundBoxDevice,
} from '../../types/fintech';

export interface IPaymentProvider {
  processPayment(params: {
    amount: number;
    payeeName: string;
    payeeVpa?: string;
    payerAccount: string;
    idempotencyKey: string;
    type: 'P2P_QR' | 'P2M_QR' | 'BILL_PAY' | 'CARD_SPEND' | 'SOFTPOS_TAP' | 'TRANSFER';
    subTitle?: string;
    category?: string;
  }): Promise<FintechTransaction>;

  checkTransactionStatus(transactionId: string): Promise<FintechTransaction>;
}

export interface IQRProvider {
  decodeQR(payload: string): Promise<DecodedQRData>;
  generateUpiQR(params: {
    upiId: string;
    name: string;
    amount?: number;
    note?: string;
    invoiceRef?: string;
  }): Promise<string>;
  validateRecipient(vpa: string): Promise<{ isValid: boolean; recipientName: string; isMerchant: boolean }>;
}

export interface IBillerProvider {
  searchBillers(query: string, category?: string): Promise<BillerInfo[]>;
  getBillerByCode(code: string): Promise<BillerInfo | null>;
  fetchBill(billerCode: string, consumerNumber: string): Promise<BillFetchResult>;
  payBill(params: {
    billerCode: string;
    consumerNumber: string;
    amount: number;
    payerAccount: string;
  }): Promise<FintechTransaction>;
}

export interface ICardProvider {
  getCards(): Promise<QTPayCard[]>;
  issueVirtualCard(cardholderName: string, linkedBankId: string): Promise<QTPayCard>;
  updateCardStatus(cardId: string, status: 'ACTIVE' | 'FROZEN' | 'BLOCKED'): Promise<QTPayCard>;
  updateCardLimits(cardId: string, limits: QTPayCard['limits']): Promise<QTPayCard>;
  replaceCard(cardId: string, reason: string): Promise<QTPayCard>;
}

export interface ISoftPosProvider {
  checkDeviceEligibility(): Promise<{
    eligible: boolean;
    nfcAvailable: boolean;
    securityAttested: boolean;
    terminalId: string;
  }>;
  startTapToPay(terminalId: string, amount: number): Promise<SoftPosSession>;
  cancelSession(terminalId: string): Promise<void>;
}

export interface ISoundBoxProvider {
  getDeviceStatus(): Promise<SoundBoxDevice>;
  updateSettings(settings: Partial<SoundBoxDevice>): Promise<SoundBoxDevice>;
  announcePayment(amount: number, language: string, merchantName?: string): Promise<boolean>;
  playTestChime(): Promise<boolean>;
}
