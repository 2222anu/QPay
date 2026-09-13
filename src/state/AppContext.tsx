import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User,
  BankAccount,
  Transaction,
  AppNotification,
  Contact,
  ElectricityBill,
  MoneyRequest,
  DeviceSession,
  ScreenId,
  BottomTab,
} from '../types';
import { authService } from '../services/authService';
import { bankService } from '../services/bankService';
import { transactionService } from '../services/transactionService';
import { notificationService } from '../services/notificationService';
import { billPaymentService } from '../services/billPaymentService';
import { translate, setGlobalLanguage, type SupportedLanguage } from '../utils/i18n';
import { applyLanguageToDOM } from '../utils/domTranslator';
import { formatCurrency } from '../utils/formatters';

export interface MerchantTxn {
  id: string;
  customerName: string;
  time: string;
  method: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  cardScheme?: 'mada' | 'Visa' | 'Mastercard';
}

export interface MerchantProfile {
  tradeName: string;
  legalName: string;
  crNumber: string;
  vatNumber: string;
  category: string;
  city: string;
  bankName: string;
  ibanMasked: string;
  merchantUpi: string;
  settlementMode: 'INSTANT' | 'DAILY';
}

interface AppContextType {
  // Navigation & Screen Stack
  currentScreen: ScreenId;
  navigateTo: (screen: ScreenId, params?: Record<string, any>) => void;
  goBack: () => void;
  screenParams: Record<string, any>;
  activeTab: BottomTab;
  setActiveTab: (tab: BottomTab) => void;
  startOnboardingFlow: () => void;

  // App Data State
  user: User;
  bankAccounts: BankAccount[];
  transactions: Transaction[];
  notifications: AppNotification[];
  contacts: Contact[];
  merchants: Contact[];
  moneyRequests: MoneyRequest[];
  deviceSessions: DeviceSession[];
  lastTransaction: Transaction | null;
  electricityBill: ElectricityBill | null;
  language: string;
  isRtl: boolean;
  t: (key: string) => string;

  // Actions
  updateUser: (updatedData: Partial<User>) => void;
  toggleShowBalance: (bankId: string) => void;
  addBankAccount: (bankName: string) => Promise<void>;
  removeBankAccount: (bankId: string) => void;
  setPrimaryBank: (bankId: string) => void;
  fetchElectricityBill: (consumerNo: string) => Promise<ElectricityBill>;
  completePayment: (params: {
    title: string;
    subTitle: string;
    amount: number;
    avatarInitials?: string;
    category?: string;
  }) => Promise<Transaction>;

  // Modals & Bottom Sheets
  isPinModalOpen: boolean;
  openPinModal: (paymentData: { title: string; amount: number; subTitle: string; onSuccess?: () => void }) => void;
  closePinModal: () => void;
  pendingPaymentData: { title: string; amount: number; subTitle: string; onSuccess?: () => void } | null;

  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  setAppLanguage: (lang: string) => void;

  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (open: boolean) => void;
  performLogout: () => void;

  isAddBankModalOpen: boolean;
  setIsAddBankModalOpen: (open: boolean) => void;

  isScanModalOpen: boolean;
  setIsScanModalOpen: (open: boolean) => void;

  isAppLinksModalOpen: boolean;
  setIsAppLinksModalOpen: (open: boolean) => void;

  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: (open: boolean) => void;

  terminateSession: (sessionId: string) => void;
  addMoneyRequest: (req: { name: string; upiId: string; amount: number; note?: string }) => void;

  // Merchant Ecosystem
  accountRole: 'CUSTOMER' | 'MERCHANT';
  setAccountRole: (role: 'CUSTOMER' | 'MERCHANT') => void;
  merchantProfile: MerchantProfile;
  updateMerchantProfile: (updated: Partial<MerchantProfile>) => void;
  merchantTxns: MerchantTxn[];
  addMerchantTxn: (txn: Omit<MerchantTxn, 'id'>) => void;
  todayCollections: number;
  settleMerchantCollections: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const FREQUENT_CONTACTS: Contact[] = [
  { id: 'c-1', name: 'Tariq Al-Harbi', upiId: 'tariq@qtpay', mobile: '+966 50 234 5678', avatarInitials: 'TH' },
  { id: 'c-2', name: 'Sara Al-Mansoor', upiId: 'sara@qtpay', mobile: '+966 55 345 6789', avatarInitials: 'SM' },
  { id: 'c-3', name: 'Omar Khalid', upiId: 'omar@qtpay', mobile: '+966 54 456 7890', avatarInitials: 'OK' },
  { id: 'c-4', name: 'Fahad Al-Otaibi', upiId: 'fahad@qtpay', mobile: '+966 56 567 8901', avatarInitials: 'FO' },
  { id: 'c-5', name: 'Noura Al-Zahrani', upiId: 'noura@qtpay', mobile: '+966 50 678 9012', avatarInitials: 'NZ' },
  { id: 'c-6', name: 'Mohammed Al-Ghamdi', upiId: 'mohammed@qtpay', mobile: '+966 53 789 0123', avatarInitials: 'MG' },
];

const MERCHANTS: Contact[] = [
  { id: 'm-1', name: 'Tamimi Markets', upiId: 'tamimi@qtpay', mobile: 'Merchant #8491', avatarInitials: 'TM', isMerchant: true },
  { id: 'm-2', name: 'Panda Retail', upiId: 'panda@qtpay', mobile: 'Merchant #2041', avatarInitials: 'PR', isMerchant: true },
];

const INITIAL_SESSIONS: DeviceSession[] = [
  { id: 's-1', deviceName: 'QTPay app (mobile)', deviceType: 'mobile', location: 'Primary Phone - Android 14', lastActive: 'Active Now', isCurrent: true },
  { id: 's-2', deviceName: 'QTPay app (mobile)', deviceType: 'mobile', location: 'iPhone 15 Pro', lastActive: '2 days ago', isCurrent: false },
  { id: 's-3', deviceName: 'QTPay app (mobile)', deviceType: 'mobile', location: 'Samsung Galaxy S23', lastActive: '1 week ago', isCurrent: false },
  { id: 's-4', deviceName: 'Windows browser', deviceType: 'browser', location: 'Chrome 128 / Windows 11', lastActive: 'Active Now', isCurrent: false },
  { id: 's-5', deviceName: 'Windows browser', deviceType: 'browser', location: 'Edge 126 / Windows 11', lastActive: '3 days ago', isCurrent: false },
  { id: 's-6', deviceName: 'Windows browser', deviceType: 'browser', location: 'Firefox 120 / Windows 10', lastActive: '2 weeks ago', isCurrent: false },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('HOME');
  const [screenStack, setScreenStack] = useState<{ screen: ScreenId; params?: Record<string, any> }[]>([
    { screen: 'HOME' },
  ]);
  const [screenParams, setScreenParams] = useState<Record<string, any>>({});
  const [activeTab, setActiveTabState] = useState<BottomTab>('home');

  const [user, setUser] = useState<User>({
    name: 'Anu',
    avatarInitials: 'AN',
    upiId: 'anu@qtpay',
    mobile: '+966 50 123 4567',
    email: 'anu@qtpay.com',
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [electricityBill, setElectricityBill] = useState<ElectricityBill | null>(null);

  // Merchant State
  const [accountRole, setAccountRole] = useState<'CUSTOMER' | 'MERCHANT'>('CUSTOMER');
  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile>({
    tradeName: 'Anu Super Retail',
    legalName: 'Anu Trading & Retail LLC',
    crNumber: 'CR 1010892412',
    vatNumber: 'VAT 310294819200003',
    category: 'Grocery & Supermarket',
    city: 'Riyadh, Saudi Arabia',
    bankName: 'Al Rajhi Bank',
    ibanMasked: 'SA92 8000 •••• •••• 3400 01',
    merchantUpi: 'anusuper@qtpay',
    settlementMode: 'INSTANT',
  });

  const [todayCollections, setTodayCollections] = useState<number>(18450.0);
  const [merchantTxns, setMerchantTxns] = useState<MerchantTxn[]>([
    { id: 'm-tx-1', customerName: 'Sara Al-Mansoor', time: '10:42 AM', method: 'mada Contactless', amount: 450.0, status: 'SUCCESS', cardScheme: 'mada' },
    { id: 'm-tx-2', customerName: 'Tariq Al-Harbi', time: '09:15 AM', method: 'mada Contactless', amount: 1200.0, status: 'SUCCESS', cardScheme: 'mada' },
    { id: 'm-tx-3', customerName: 'Omar Khalid', time: '08:50 AM', method: 'QR Standee', amount: 85.5, status: 'SUCCESS' },
    { id: 'm-tx-4', customerName: 'Fahad Al-Otaibi', time: 'Yesterday', method: 'Visa Contactless', amount: 320.0, status: 'SUCCESS', cardScheme: 'Visa' },
    { id: 'm-tx-5', customerName: 'Noura Al-Zahrani', time: 'Yesterday', method: 'QR Standee', amount: 120.0, status: 'PENDING' },
  ]);

  const updateMerchantProfile = (updated: Partial<MerchantProfile>) => {
    setMerchantProfile((prev) => ({ ...prev, ...updated }));
  };

  const addMerchantTxn = (txn: Omit<MerchantTxn, 'id'>) => {
    const newTxn: MerchantTxn = {
      ...txn,
      id: `m-tx-${Date.now()}`,
    };
    setMerchantTxns((prev) => [newTxn, ...prev]);
    if (txn.status === 'SUCCESS') {
      setTodayCollections((prev) => prev + txn.amount);
    }
  };

  const settleMerchantCollections = () => {
    setTodayCollections(0);
  };
  const [moneyRequests, setMoneyRequests] = useState<MoneyRequest[]>([
    {
      id: 'req-1',
      requesterName: 'Priya Menon',
      upiId: 'priya@paytm',
      amount: 450.0,
      note: 'Dinner split',
      date: '1 day ago',
      status: 'pending',
    },
  ]);
  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>(INITIAL_SESSIONS);

  const [language, setLanguage] = useState<string>(() => {
    try {
      return localStorage.getItem('qtpay_lang') || 'English';
    } catch {
      return 'English';
    }
  });
  const [isRtl, setIsRtl] = useState<boolean>(() => {
    try {
      return localStorage.getItem('qtpay_lang') === 'العربية';
    } catch {
      return false;
    }
  });

  const t = (key: string) => translate(key, language as SupportedLanguage);

  useEffect(() => {
    applyLanguageToDOM(language as SupportedLanguage);
  }, [language]);

  // Modals state
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pendingPaymentData, setPendingPaymentData] = useState<{
    title: string;
    amount: number;
    subTitle: string;
    onSuccess?: () => void;
  } | null>(null);

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [isAppLinksModalOpen, setIsAppLinksModalOpen] = useState<boolean>(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check URL query parameters for test automation (e.g. ?screen=ELECTRICITY)
    const urlParams = new URLSearchParams(window.location.search);
    const initialScreen = urlParams.get('screen') as ScreenId | null;
    if (initialScreen) {
      setCurrentScreen(initialScreen);
      setScreenStack([{ screen: initialScreen }]);
    }

    // Load initial data
    authService.getCurrentUser().then(setUser);
    bankService.getBankAccounts().then(setBankAccounts);
    transactionService.getInitialTransactions().then(setTransactions);
    notificationService.getInitialNotifications().then(setNotifications);
  }, []);

  // Expose global test helpers for Playwright / automation verification
  useEffect(() => {
    (window as any).__qtpay = {
      navigateTo,
      goBack,
      openPinModal,
      closePinModal,
      setIsLanguageModalOpen,
      setIsLogoutModalOpen,
      setIsAddBankModalOpen,
      setIsScanModalOpen,
      setIsAppLinksModalOpen,
      setIsEditProfileModalOpen,
      setAppLanguage,
      currentScreen,
    };
  });

  const startOnboardingFlow = () => {
    localStorage.removeItem('hasSeenOnboarding');
    setCurrentScreen('SPLASH');
    setScreenStack([{ screen: 'SPLASH' }]);
    setTimeout(() => {
      setCurrentScreen('ONBOARDING');
      setScreenStack([{ screen: 'ONBOARDING' }]);
    }, 1800);
  };

  const navigateTo = (screen: ScreenId, params?: Record<string, any>) => {
    setScreenParams(params || {});
    setCurrentScreen(screen);
    setScreenStack((prev) => [...prev, { screen, params }]);

    // Sync bottom navigation active tab
    if (screen === 'HOME') setActiveTabState('home');
    else if (screen === 'BANK_ACCOUNTS') setActiveTabState('account');
    else if (screen === 'PAY_ANYONE') setActiveTabState('pay');
    else if (screen === 'HISTORY') setActiveTabState('history');
    else if (screen === 'PROFILE') setActiveTabState('profile');
  };

  const goBack = () => {
    if (screenStack.length > 1) {
      const newStack = [...screenStack];
      newStack.pop();
      const prev = newStack[newStack.length - 1];
      setScreenStack(newStack);
      setCurrentScreen(prev.screen);
      setScreenParams(prev.params || {});

      if (prev.screen === 'HOME') setActiveTabState('home');
      else if (prev.screen === 'BANK_ACCOUNTS') setActiveTabState('account');
      else if (prev.screen === 'PAY_ANYONE') setActiveTabState('pay');
      else if (prev.screen === 'HISTORY') setActiveTabState('history');
      else if (prev.screen === 'PROFILE') setActiveTabState('profile');
    } else {
      navigateTo('HOME');
    }
  };

  const setActiveTab = (tab: BottomTab) => {
    setActiveTabState(tab);
    switch (tab) {
      case 'home':
        navigateTo('HOME');
        break;
      case 'account':
        navigateTo('BANK_ACCOUNTS');
        break;
      case 'pay':
        navigateTo('PAY_ANYONE');
        break;
      case 'scan':
        setIsScanModalOpen(true);
        break;
      case 'history':
        navigateTo('HISTORY');
        break;
      case 'profile':
        navigateTo('PROFILE');
        break;
    }
  };

  const toggleShowBalance = (bankId: string) => {
    setBankAccounts((prev) =>
      prev.map((acc) => (acc.id === bankId ? { ...acc, showBalance: !acc.showBalance } : acc))
    );
  };

  const addBankAccount = async (bankName: string) => {
    const newBank = await bankService.addBankAccount(bankName);
    setBankAccounts((prev) => [...prev, newBank]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Bank linked',
      description: `${bankName} was linked successfully.`,
      timestamp: 'Just now',
      read: false,
      type: 'info',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const removeBankAccount = (bankId: string) => {
    setBankAccounts((prev) => {
      const remaining = prev.filter((acc) => acc.id !== bankId);
      if (remaining.length > 0 && !remaining.some((a) => a.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return remaining;
    });
  };

  const setPrimaryBank = (bankId: string) => {
    setBankAccounts((prev) =>
      prev.map((acc) => ({
        ...acc,
        isPrimary: acc.id === bankId,
      }))
    );
  };

  const fetchElectricityBill = async (consumerNo: string) => {
    const bill = await billPaymentService.fetchElectricityBill(consumerNo);
    setElectricityBill(bill);
    return bill;
  };

  const completePayment = async (params: {
    title: string;
    subTitle: string;
    amount: number;
    avatarInitials?: string;
    category?: string;
  }) => {
    const newTxn: Transaction = {
      id: 'QT' + Math.floor(10000000000 + Math.random() * 90000000000).toString(),
      title: params.title,
      subTitle: params.subTitle,
      amount: params.amount,
      type: 'sent',
      date: 'TODAY',
      timestamp: new Date(),
      utr: 'UTR' + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      avatarInitials: params.avatarInitials || params.title.substring(0, 2).toUpperCase(),
      category: params.category || 'Payment',
    };

    setTransactions((prev) => [newTxn, ...prev]);
    setLastTransaction(newTxn);

    const formattedAmt = formatCurrency(params.amount);
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Payment successful',
      description: `${formattedAmt} paid to ${params.title}`,
      timestamp: 'Just now',
      read: false,
      type: 'success',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newTxn;
  };

  const openPinModal = (data: { title: string; amount: number; subTitle: string; onSuccess?: () => void }) => {
    setPendingPaymentData(data);
    setIsPinModalOpen(true);
  };

  const closePinModal = () => {
    setIsPinModalOpen(false);
    setPendingPaymentData(null);
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => {
      const newName = updatedData.name !== undefined ? updatedData.name : prev.name;
      const initials = newName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'QT';

      return {
        ...prev,
        ...updatedData,
        avatarInitials: initials,
      };
    });
  };

  const setAppLanguage = (lang: string) => {
    setLanguage(lang);
    setGlobalLanguage(lang as SupportedLanguage);
    setIsRtl(lang === 'العربية');
    setIsLanguageModalOpen(false);
    applyLanguageToDOM(lang as SupportedLanguage);
  };

  const performLogout = () => {
    localStorage.removeItem('hasSeenOnboarding');
    setIsLogoutModalOpen(false);
    setCurrentScreen('SPLASH');
    setScreenStack([{ screen: 'SPLASH' }]);
    setTimeout(() => {
      setCurrentScreen('ONBOARDING');
      setScreenStack([{ screen: 'ONBOARDING' }]);
    }, 1800);
  };

  const terminateSession = (sessionId: string) => {
    setDeviceSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const addMoneyRequest = (req: { name: string; upiId: string; amount: number; note?: string }) => {
    const newReq: MoneyRequest = {
      id: `req-${Date.now()}`,
      requesterName: req.name,
      upiId: req.upiId,
      amount: req.amount,
      note: req.note,
      date: 'Just now',
      status: 'pending',
    };
    setMoneyRequests((prev) => [newReq, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        goBack,
        screenParams,
        activeTab,
        setActiveTab,
        startOnboardingFlow,
        user,
        bankAccounts,
        transactions,
        notifications,
        contacts: FREQUENT_CONTACTS,
        merchants: MERCHANTS,
        moneyRequests,
        deviceSessions,
        lastTransaction,
        electricityBill,
        language,
        isRtl,
        t,
        updateUser,
        toggleShowBalance,
        addBankAccount,
        removeBankAccount,
        setPrimaryBank,
        fetchElectricityBill,
        completePayment,
        isPinModalOpen,
        openPinModal,
        closePinModal,
        pendingPaymentData,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        setAppLanguage,
        isLogoutModalOpen,
        setIsLogoutModalOpen,
        performLogout,
        isAddBankModalOpen,
        setIsAddBankModalOpen,
        isScanModalOpen,
        setIsScanModalOpen,
        isAppLinksModalOpen,
        setIsAppLinksModalOpen,
        isEditProfileModalOpen,
        setIsEditProfileModalOpen,
        terminateSession,
        addMoneyRequest,
        accountRole,
        setAccountRole,
        merchantProfile,
        updateMerchantProfile,
        merchantTxns,
        addMerchantTxn,
        todayCollections,
        settleMerchantCollections,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
