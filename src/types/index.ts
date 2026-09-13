export interface User {
  name: string;
  avatarInitials: string;
  avatarUrl?: string;
  avatarBgColor?: string;
  upiId: string;
  mobile: string;
  email: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  accountNumberMasked: string;
  isPrimary: boolean;
  balance: number;
  showBalance?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  upiId: string;
  mobile: string;
  avatarInitials: string;
  isMerchant?: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  subTitle?: string;
  amount: number;
  type: 'sent' | 'received' | 'pending';
  date: string;
  timestamp: Date;
  utr: string;
  accountUsed?: string;
  category?: string;
  avatarInitials?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'success' | 'info' | 'alert';
}

export interface ElectricityBill {
  consumerNumber: string;
  providerName: string;
  amount: number;
  dueDate: string;
  billDate: string;
  isPaid: boolean;
}

export interface MoneyRequest {
  id: string;
  requesterName: string;
  upiId: string;
  amount: number;
  note?: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface DeviceSession {
  id: string;
  deviceName: string;
  deviceType: 'mobile' | 'browser';
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export type ScreenId =
  | 'SPLASH'
  | 'ONBOARDING'
  | 'MOBILE_NUMBER'
  | 'SMS_OTP'
  | 'PERMISSIONS'
  | 'HOME'
  | 'PAY_ANYONE'
  | 'SEND_AMOUNT'
  | 'ELECTRICITY'
  | 'PAYMENT_SUCCESS'
  | 'HISTORY'
  | 'RECEIVE'
  | 'SCAN'
  | 'REQUEST_MONEY'
  | 'PROFILE'
  | 'BANK_ACCOUNTS'
  | 'UPI_SETTINGS'
  | 'PAYMENT_METHODS'
  | 'SECURITY'
  | 'NOTIFICATIONS'
  | 'ALL_SERVICES'
  | 'MONEY_REQUESTS'
  | 'HELP_SUPPORT'
  | 'PRIVACY'
  | 'SHOPPING'
  | 'MESSAGES'
  | 'TRAVEL'
  | 'REWARDS'
  | 'FOOD'
  | 'CUSTOMER_KYC'
  | 'CUSTOMER_PIN_SETUP'
  | 'CUSTOMER_SECURITY_SETUP'
  | 'BILLER_CODE'
  | 'CARDS'
  | 'MERCHANT_DASHBOARD'
  | 'MERCHANT_ONBOARDING'
  | 'SOFTPOS'
  | 'SOUND_BOX';

export type BottomTab = 'home' | 'account' | 'pay' | 'scan' | 'history' | 'profile';

export * from './fintech';
