/**
 * QTPay Advanced Fintech Domain Types
 * Defines comprehensive models for:
 * - Transaction Lifecycle & State Machine
 * - QR Payment Ecosystem (P2P & P2M)
 * - BBPS Biller Code System
 * - Virtual & Physical Cards Management
 * - Merchant Multi-Role Ecosystem
 * - SoftPOS Contactless Architecture
 * - Sound Box Hardware & Audio Notification
 */

export type TransactionStatus =
  | 'INITIATED'
  | 'VALIDATING'
  | 'AUTHENTICATION_REQUIRED'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'TIMEOUT';

export interface FintechTransaction {
  id: string;
  utr: string;
  idempotencyKey: string;
  type: 'P2P_QR' | 'P2M_QR' | 'BILL_PAY' | 'CARD_SPEND' | 'SOFTPOS_TAP' | 'TRANSFER';
  title: string;
  subTitle: string;
  amount: number;
  fee: number;
  currency: 'SAR';
  status: TransactionStatus;
  timestamp: Date;
  dateStr: string;
  payeeName: string;
  payeeVpa?: string;
  payerAccount: string;
  authMethod?: 'UPI_PIN' | 'BIOMETRIC' | 'CHIP_PIN';
  errorCode?: string;
  errorMessage?: string;
  receiptNumber?: string;
  metadata?: Record<string, any>;
}

// -------------------------------------------------------------
// QR Payment Models
// -------------------------------------------------------------
export type QRType = 'P2P' | 'P2M';
export type QRFormat = 'STATIC' | 'DYNAMIC';

export interface DecodedQRData {
  rawPayload: string;
  type: QRType;
  format: QRFormat;
  payeeName: string;
  payeeVpa: string;
  merchantCode?: string;
  merchantCategory?: string;
  amount?: number;
  note?: string;
  invoiceRef?: string;
  expiresAt?: Date;
  isExpired?: boolean;
  isValid: boolean;
  validationError?: string;
}

// -------------------------------------------------------------
// BBPS & Biller Code Models
// -------------------------------------------------------------
export interface BillerInfo {
  billerId: string;
  billerCode: string;
  billerName: string;
  category: 'Electricity' | 'Water' | 'Gas' | 'Broadband' | 'Mobile Postpaid' | 'FASTag' | 'Insurance' | 'Loan';
  state?: string;
  accountParamName: string;
  accountParamPlaceholder: string;
  regexPattern: string;
  supportsPartialPay: boolean;
  status: 'ACTIVE' | 'DOWN_MAINTENANCE' | 'DEPRECATED';
}

export interface BillFetchResult {
  billerId: string;
  billerCode: string;
  consumerNumber: string;
  consumerName: string;
  billNumber: string;
  billDate: string;
  dueDate: string;
  billPeriod: string;
  amountDue: number;
  minimumDue?: number;
  lateFee: number;
  isAlreadyPaid: boolean;
  status: 'FETCHED' | 'NOT_FOUND' | 'ALREADY_PAID' | 'FAILED';
  errorMessage?: string;
}

// -------------------------------------------------------------
// Cards Models
// -------------------------------------------------------------
export type CardType = 'VIRTUAL' | 'PHYSICAL';
export type CardNetwork = 'RuPay' | 'Visa' | 'Mastercard';
export type CardStatus = 'ACTIVE' | 'FROZEN' | 'BLOCKED' | 'EXPIRED';

export interface CardLimits {
  onlineEnabled: boolean;
  onlineLimit: number;
  posContactlessEnabled: boolean;
  posContactlessLimit: number;
  atmWithdrawalEnabled: boolean;
  atmLimit: number;
  internationalEnabled: boolean;
}

export interface QTPayCard {
  id: string;
  cardholderName: string;
  maskedNumber: string;
  fullCardNumberSecure: string;
  expiryMonth: string;
  expiryYear: string;
  cvvSecure: string;
  cardType: CardType;
  network: CardNetwork;
  status: CardStatus;
  linkedBankId: string;
  limits: CardLimits;
  dailySpent: number;
  createdAt: string;
}

// -------------------------------------------------------------
// Merchant Models
// -------------------------------------------------------------
export type AppRole = 'CUSTOMER' | 'MERCHANT';

export type MerchantVerificationStatus = 'VERIFIED' | 'PENDING_REVIEW' | 'ACTION_REQUIRED' | 'REJECTED';

export interface MerchantSettlementConfig {
  accountNumberMasked: string;
  iban?: string;
  ifsc?: string;
  bankName: string;
  mode: 'INSTANT_SETTLEMENT' | 'DAILY_BATCH_2AM';
}

export interface MerchantProfile {
  id: string;
  businessName: string;
  tradeName: string;
  businessCategory: string;
  crNumber?: string;
  vatNumber?: string;
  gstin?: string;
  businessPan?: string;
  storeAddress: string;
  city: string;
  pincode: string;
  contactMobile: string;
  contactEmail: string;
  ownerName: string;
  verificationStatus: MerchantVerificationStatus;
  todayCollections: number;
  todayTransactionCount: number;
  settlementConfig: MerchantSettlementConfig;
  qrStandeeId: string;
  soundBoxPaired: boolean;
  softPosEnabled: boolean;
}

// -------------------------------------------------------------
// SoftPOS Models
// -------------------------------------------------------------
export type SoftPosDeviceState = 'CHECKING' | 'ELIGIBLE' | 'NFC_DISABLED' | 'UNSUPPORTED';
export type SoftPosTxnState =
  | 'IDLE'
  | 'WAITING_CARD'
  | 'CARD_DETECTED'
  | 'PIN_REQUIRED'
  | 'AUTHORIZING'
  | 'APPROVED'
  | 'DECLINED'
  | 'TIMEOUT'
  | 'CANCELLED';

export interface SoftPosSession {
  terminalId: string;
  amount: number;
  status: SoftPosTxnState;
  cardBrand?: string;
  maskedCard?: string;
  authCode?: string;
  referenceId?: string;
  isSimulated: boolean;
  errorMessage?: string;
}

// -------------------------------------------------------------
// Sound Box Models
// -------------------------------------------------------------
export type SoundBoxConnectionState = 'SEARCHING' | 'PAIRED' | 'CONNECTED' | 'OFFLINE';

export interface SoundBoxDevice {
  deviceId: string;
  name: string;
  model: string;
  connectionState: SoundBoxConnectionState;
  batteryLevel: number;
  networkSignal: '4G_LTE' | 'WIFI' | 'OFFLINE';
  volume: number; // 1 - 10
  language: 'Arabic' | 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Marathi';
  lastSpokenText?: string;
  lastSpokenTimestamp?: Date;
}
