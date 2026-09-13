import type {
  IPaymentProvider,
  IQRProvider,
  IBillerProvider,
  ICardProvider,
  ISoftPosProvider,
  ISoundBoxProvider,
} from './interfaces';
import type {
  FintechTransaction,
  DecodedQRData,
  BillerInfo,
  BillFetchResult,
  QTPayCard,
  SoftPosSession,
  SoundBoxDevice,
} from '../../types/fintech';
import { generateTxnId, generateUTR } from '../../utils/formatters';

// -------------------------------------------------------------
// Mock Payment Provider with Idempotency & State Simulation
// -------------------------------------------------------------
export class MockPaymentProvider implements IPaymentProvider {
  private processedKeys = new Set<string>();

  async processPayment(params: {
    amount: number;
    payeeName: string;
    payeeVpa?: string;
    payerAccount: string;
    idempotencyKey: string;
    type: 'P2P_QR' | 'P2M_QR' | 'BILL_PAY' | 'CARD_SPEND' | 'SOFTPOS_TAP' | 'TRANSFER';
    subTitle?: string;
    category?: string;
  }): Promise<FintechTransaction> {
    // Check Idempotency Key
    if (this.processedKeys.has(params.idempotencyKey)) {
      throw new Error(`Duplicate transaction detected with idempotency key: ${params.idempotencyKey}`);
    }
    this.processedKeys.add(params.idempotencyKey);

    // Simulate network processing
    await new Promise((resolve) => setTimeout(resolve, 650));

    return {
      id: generateTxnId(),
      utr: generateUTR(),
      idempotencyKey: params.idempotencyKey,
      type: params.type,
      title: params.payeeName,
      subTitle: params.subTitle || 'Instant UPI Transfer',
      amount: params.amount,
      fee: 0,
      currency: 'INR',
      status: 'SUCCESS',
      timestamp: new Date(),
      dateStr: 'TODAY',
      payeeName: params.payeeName,
      payeeVpa: params.payeeVpa,
      payerAccount: params.payerAccount,
      receiptNumber: `REC-${Date.now().toString().slice(-8)}`,
    };
  }

  async checkTransactionStatus(transactionId: string): Promise<FintechTransaction> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      id: transactionId,
      utr: generateUTR(),
      idempotencyKey: `idem-${transactionId}`,
      type: 'TRANSFER',
      title: 'Verified Transaction',
      subTitle: 'UPI Bank Transfer',
      amount: 100,
      fee: 0,
      currency: 'INR',
      status: 'SUCCESS',
      timestamp: new Date(),
      dateStr: 'TODAY',
      payeeName: 'Verified Payee',
      payerAccount: 'ICICI Bank Savings **** 3616',
    };
  }
}

// -------------------------------------------------------------
// Mock QR Provider
// -------------------------------------------------------------
export class MockQRProvider implements IQRProvider {
  async decodeQR(payload: string): Promise<DecodedQRData> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const trimmed = (payload || '').trim();

    // Check for UPI scheme
    if (trimmed.startsWith('upi://pay')) {
      try {
        const url = new URL(trimmed);
        const pa = url.searchParams.get('pa') || '';
        const pn = url.searchParams.get('pn') || 'Merchant / Recipient';
        const amStr = url.searchParams.get('am');
        const amount = amStr ? parseFloat(amStr) : undefined;
        const note = url.searchParams.get('tn') || undefined;
        const mc = url.searchParams.get('mc') || undefined;
        const isMerchant = Boolean(mc) || pa.includes('icici') || pa.includes('merchant');

        return {
          rawPayload: payload,
          type: isMerchant ? 'P2M' : 'P2P',
          format: amount ? 'DYNAMIC' : 'STATIC',
          payeeName: decodeURIComponent(pn),
          payeeVpa: pa,
          merchantCode: mc,
          amount,
          note,
          isValid: Boolean(pa && pa.includes('@')),
        };
      } catch {
        return {
          rawPayload: payload,
          type: 'P2P',
          format: 'STATIC',
          payeeName: 'Unknown',
          payeeVpa: '',
          isValid: false,
          validationError: 'Invalid UPI QR URL scheme',
        };
      }
    }

    // Check for BharatQR or custom QTPay JSON QR
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        return {
          rawPayload: payload,
          type: parsed.type || 'P2M',
          format: parsed.amount ? 'DYNAMIC' : 'STATIC',
          payeeName: parsed.name || 'Store Merchant',
          payeeVpa: parsed.vpa || 'merchant@qtpay',
          merchantCode: parsed.mc || '5411',
          amount: parsed.amount,
          invoiceRef: parsed.inv,
          isExpired: parsed.exp ? new Date(parsed.exp) < new Date() : false,
          isValid: true,
        };
      } catch {
        return {
          rawPayload: payload,
          type: 'P2P',
          format: 'STATIC',
          payeeName: '',
          payeeVpa: '',
          isValid: false,
          validationError: 'Malformed QR payload',
        };
      }
    }

    // Plain VPA string (e.g. rahul@upi)
    if (trimmed.includes('@') && !trimmed.includes(' ')) {
      return {
        rawPayload: payload,
        type: 'P2P',
        format: 'STATIC',
        payeeName: trimmed.split('@')[0],
        payeeVpa: trimmed,
        isValid: true,
      };
    }

    return {
      rawPayload: payload,
      type: 'P2P',
      format: 'STATIC',
      payeeName: '',
      payeeVpa: '',
      isValid: false,
      validationError: 'Unsupported QR standard. Must be a valid UPI or BharatQR payload.',
    };
  }

  async generateUpiQR(params: {
    upiId: string;
    name: string;
    amount?: number;
    note?: string;
    invoiceRef?: string;
  }): Promise<string> {
    let url = `upi://pay?pa=${encodeURIComponent(params.upiId)}&pn=${encodeURIComponent(params.name)}&cu=INR`;
    if (params.amount && params.amount > 0) {
      url += `&am=${params.amount}`;
    }
    if (params.note) {
      url += `&tn=${encodeURIComponent(params.note)}`;
    }
    if (params.invoiceRef) {
      url += `&tr=${encodeURIComponent(params.invoiceRef)}`;
    }
    return url;
  }

  async validateRecipient(vpa: string): Promise<{ isValid: boolean; recipientName: string; isMerchant: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!vpa || !vpa.includes('@')) {
      return { isValid: false, recipientName: '', isMerchant: false };
    }
    const isMerchant = vpa.includes('store') || vpa.includes('mart') || vpa.includes('corp');
    return {
      isValid: true,
      recipientName: vpa.split('@')[0].toUpperCase(),
      isMerchant,
    };
  }
}

// -------------------------------------------------------------
// Mock BBPS Biller Provider
// -------------------------------------------------------------
export const POPULAR_BILLERS: BillerInfo[] = [
  {
    billerId: 'b-elec-mseb',
    billerCode: 'MSEB-01',
    billerName: 'Maharashtra State Electricity Board (MSEDCL)',
    category: 'Electricity',
    state: 'Maharashtra',
    accountParamName: 'Consumer Number (12 Digits)',
    accountParamPlaceholder: 'e.g. 028540192842',
    regexPattern: '^[0-9]{12}$',
    supportsPartialPay: true,
    status: 'ACTIVE',
  },
  {
    billerId: 'b-elec-tata',
    billerCode: 'TATA-DELHI',
    billerName: 'Tata Power DDL (Delhi)',
    category: 'Electricity',
    state: 'Delhi',
    accountParamName: 'CA Number',
    accountParamPlaceholder: 'e.g. 60001234567',
    regexPattern: '^[0-9]{11}$',
    supportsPartialPay: false,
    status: 'ACTIVE',
  },
  {
    billerId: 'b-gas-adani',
    billerCode: 'ADANI-GAS',
    billerName: 'Adani Total Gas Limited',
    category: 'Gas',
    accountParamName: 'Customer ID',
    accountParamPlaceholder: 'e.g. 100098234',
    regexPattern: '^[0-9]{9}$',
    supportsPartialPay: true,
    status: 'ACTIVE',
  },
  {
    billerId: 'b-water-delhi',
    billerCode: 'DELHI-JAL',
    billerName: 'Delhi Jal Board (DJB)',
    category: 'Water',
    state: 'Delhi',
    accountParamName: 'K No.',
    accountParamPlaceholder: 'e.g. 1234567890',
    regexPattern: '^[0-9]{10}$',
    supportsPartialPay: false,
    status: 'ACTIVE',
  },
  {
    billerId: 'b-broadband-airtel',
    billerCode: 'AIRTEL-BROAD',
    billerName: 'Airtel Xstream Fiber Broadband',
    category: 'Broadband',
    accountParamName: 'DSL / Landline Number',
    accountParamPlaceholder: 'e.g. 01123456789',
    regexPattern: '^[0-9]{10,12}$',
    supportsPartialPay: false,
    status: 'ACTIVE',
  },
  {
    billerId: 'b-fastag-icici',
    billerCode: 'NETC-ICICI',
    billerName: 'ICICI Bank NETC FASTag',
    category: 'FASTag',
    accountParamName: 'Vehicle Registration Number (VRN)',
    accountParamPlaceholder: 'e.g. MH02AB1234',
    regexPattern: '^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$',
    supportsPartialPay: true,
    status: 'ACTIVE',
  },
];

export class MockBillerProvider implements IBillerProvider {
  async searchBillers(query: string, category?: string): Promise<BillerInfo[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const q = (query || '').toLowerCase().trim();
    return POPULAR_BILLERS.filter((b) => {
      const matchCat = category ? b.category.toLowerCase() === category.toLowerCase() : true;
      const matchQuery = q
        ? b.billerName.toLowerCase().includes(q) ||
          b.billerCode.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
        : true;
      return matchCat && matchQuery;
    });
  }

  async getBillerByCode(code: string): Promise<BillerInfo | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const normalized = (code || '').toUpperCase().trim();
    return POPULAR_BILLERS.find((b) => b.billerCode === normalized) || null;
  }

  async fetchBill(billerCode: string, consumerNumber: string): Promise<BillFetchResult> {
    await new Promise((resolve) => setTimeout(resolve, 450));
    const biller = await this.getBillerByCode(billerCode);

    if (!biller) {
      return {
        billerId: 'unknown',
        billerCode,
        consumerNumber,
        consumerName: '',
        billNumber: '',
        billDate: '',
        dueDate: '',
        billPeriod: '',
        amountDue: 0,
        lateFee: 0,
        isAlreadyPaid: false,
        status: 'FAILED',
        errorMessage: `Biller code "${billerCode}" was not found in BBPS registry.`,
      };
    }

    // Demo: consumer number ending in '000' means already paid
    if (consumerNumber.endsWith('000')) {
      return {
        billerId: biller.billerId,
        billerCode: biller.billerCode,
        consumerNumber,
        consumerName: 'Rajesh Sharma',
        billNumber: `BILL-${Date.now().toString().slice(-6)}`,
        billDate: '2026-09-01',
        dueDate: '2026-09-28',
        billPeriod: 'Aug 2026',
        amountDue: 0,
        lateFee: 0,
        isAlreadyPaid: true,
        status: 'ALREADY_PAID',
      };
    }

    // Realistic bill sample
    const sampleAmounts: Record<string, number> = {
      'MSEB-01': 2450.0,
      'TATA-DELHI': 1890.5,
      'ADANI-GAS': 780.0,
      'DELHI-JAL': 420.0,
      'AIRTEL-BROAD': 999.0,
      'NETC-ICICI': 500.0,
    };

    const amt = sampleAmounts[biller.billerCode] || 1250.0;

    return {
      billerId: biller.billerId,
      billerCode: biller.billerCode,
      consumerNumber,
      consumerName: 'Anu',
      billNumber: `BBPS-${Math.floor(10000000 + Math.random() * 90000000)}`,
      billDate: '2026-09-02',
      dueDate: '2026-09-26',
      billPeriod: 'Aug - Sep 2026',
      amountDue: amt,
      minimumDue: biller.supportsPartialPay ? 100 : undefined,
      lateFee: 50.0,
      isAlreadyPaid: false,
      status: 'FETCHED',
    };
  }

  async payBill(params: {
    billerCode: string;
    consumerNumber: string;
    amount: number;
    payerAccount: string;
  }): Promise<FintechTransaction> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      id: generateTxnId(),
      utr: generateUTR(),
      idempotencyKey: `bbps-${Date.now()}`,
      type: 'BILL_PAY',
      title: `Bill: ${params.billerCode}`,
      subTitle: `Consumer: ${params.consumerNumber}`,
      amount: params.amount,
      fee: 0,
      currency: 'INR',
      status: 'SUCCESS',
      timestamp: new Date(),
      dateStr: 'TODAY',
      payeeName: params.billerCode,
      payerAccount: params.payerAccount,
      receiptNumber: `BBPS-REC-${Date.now().toString().slice(-8)}`,
    };
  }
}

// -------------------------------------------------------------
// Mock Cards Provider
// -------------------------------------------------------------
export const INITIAL_CARDS: QTPayCard[] = [
  {
    id: 'card-rupay-1',
    cardholderName: 'Anu',
    maskedNumber: '•••• •••• •••• 9901',
    fullCardNumberSecure: '6521 8490 3218 9901',
    expiryMonth: '08',
    expiryYear: '29',
    cvvSecure: '382',
    cardType: 'VIRTUAL',
    network: 'RuPay',
    status: 'ACTIVE',
    linkedBankId: 'b-icici',
    limits: {
      onlineEnabled: true,
      onlineLimit: 50000,
      posContactlessEnabled: true,
      posContactlessLimit: 5000,
      atmWithdrawalEnabled: false,
      atmLimit: 0,
      internationalEnabled: false,
    },
    dailySpent: 4200,
    createdAt: '2026-01-15',
  },
  {
    id: 'card-visa-1',
    cardholderName: 'Anu',
    maskedNumber: '•••• •••• •••• 4182',
    fullCardNumberSecure: '4111 2345 6789 4182',
    expiryMonth: '11',
    expiryYear: '28',
    cvvSecure: '841',
    cardType: 'PHYSICAL',
    network: 'Visa',
    status: 'ACTIVE',
    linkedBankId: 'b-yes',
    limits: {
      onlineEnabled: true,
      onlineLimit: 100000,
      posContactlessEnabled: true,
      posContactlessLimit: 10000,
      atmWithdrawalEnabled: true,
      atmLimit: 25000,
      internationalEnabled: true,
    },
    dailySpent: 0,
    createdAt: '2025-11-20',
  },
];

export class MockCardProvider implements ICardProvider {
  private cards: QTPayCard[] = [...INITIAL_CARDS];

  async getCards(): Promise<QTPayCard[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...this.cards];
  }

  async issueVirtualCard(cardholderName: string, linkedBankId: string): Promise<QTPayCard> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const newCard: QTPayCard = {
      id: `card-qt-${Date.now()}`,
      cardholderName: cardholderName || 'Anu',
      maskedNumber: `•••• •••• •••• ${randomSuffix}`,
      fullCardNumberSecure: `6071 9421 ${Math.floor(1000 + Math.random() * 9000)} ${randomSuffix}`,
      expiryMonth: '09',
      expiryYear: '31',
      cvvSecure: Math.floor(100 + Math.random() * 900).toString(),
      cardType: 'VIRTUAL',
      network: 'RuPay',
      status: 'ACTIVE',
      linkedBankId,
      limits: {
        onlineEnabled: true,
        onlineLimit: 25000,
        posContactlessEnabled: true,
        posContactlessLimit: 5000,
        atmWithdrawalEnabled: false,
        atmLimit: 0,
        internationalEnabled: false,
      },
      dailySpent: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.cards.unshift(newCard);
    return newCard;
  }

  async updateCardStatus(cardId: string, status: 'ACTIVE' | 'FROZEN' | 'BLOCKED'): Promise<QTPayCard> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const card = this.cards.find((c) => c.id === cardId);
    if (!card) throw new Error('Card not found');
    card.status = status;
    return { ...card };
  }

  async updateCardLimits(cardId: string, limits: QTPayCard['limits']): Promise<QTPayCard> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const card = this.cards.find((c) => c.id === cardId);
    if (!card) throw new Error('Card not found');
    card.limits = { ...limits };
    return { ...card };
  }

  async replaceCard(cardId: string, _reason: string): Promise<QTPayCard> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const oldCard = this.cards.find((c) => c.id === cardId);
    if (!oldCard) throw new Error('Card not found');
    oldCard.status = 'BLOCKED';

    return this.issueVirtualCard(oldCard.cardholderName, oldCard.linkedBankId);
  }
}

// -------------------------------------------------------------
// Mock SoftPOS Provider
// -------------------------------------------------------------
export class MockSoftPosProvider implements ISoftPosProvider {
  async checkDeviceEligibility(): Promise<{
    eligible: boolean;
    nfcAvailable: boolean;
    securityAttested: boolean;
    terminalId: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Checks hardware NFC availability or falls back to simulation mode
    const hasNFC = typeof window !== 'undefined' && 'NDEFReader' in window;
    return {
      eligible: true,
      nfcAvailable: hasNFC || true, // Eligible with simulation layer
      securityAttested: true,
      terminalId: 'TID-QTP-9824',
    };
  }

  async startTapToPay(terminalId: string, amount: number): Promise<SoftPosSession> {
    // Return initialized session ready for tap
    return {
      terminalId,
      amount,
      status: 'WAITING_CARD',
      isSimulated: true,
    };
  }

  async cancelSession(_terminalId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// -------------------------------------------------------------
// Mock Sound Box Provider with Web Audio & SpeechSynthesis
// -------------------------------------------------------------
export class MockSoundBoxProvider implements ISoundBoxProvider {
  private device: SoundBoxDevice = {
    deviceId: 'SB-QTPAY-984',
    name: 'QTPay Smart Sound Box Pro',
    model: 'SB-2026-4G',
    connectionState: 'CONNECTED',
    batteryLevel: 94,
    networkSignal: '4G_LTE',
    volume: 8,
    language: 'English',
  };

  async getDeviceStatus(): Promise<SoundBoxDevice> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { ...this.device };
  }

  async updateSettings(settings: Partial<SoundBoxDevice>): Promise<SoundBoxDevice> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    this.device = { ...this.device, ...settings };
    return { ...this.device };
  }

  async playTestChime(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return true;
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return true;
      const ctx = new AudioContextClass();

      // Play harmonious fintech double chime (C6 - G6)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(1046.5, now); // C6
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.frequency.setValueAtTime(1567.98, now + 0.12); // G6
      gain2.gain.setValueAtTime(0.25, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.35);

      return true;
    } catch {
      return false;
    }
  }

  async announcePayment(amount: number, language: string = 'English'): Promise<boolean> {
    // 1. Play chime first
    await this.playTestChime();

    // 2. Synthesize speech if supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const amtFormatted = Math.round(amount);
        let speechText = `QTPay received ${amtFormatted} rupees.`;
        let langCode = 'en-IN';

        if (language === 'Hindi') {
          speechText = `QTPay par ${amtFormatted} rupaye prapt hue.`;
          langCode = 'hi-IN';
        } else if (language === 'Tamil') {
          speechText = `QTPay il ${amtFormatted} roobai pera-pattadhu.`;
          langCode = 'ta-IN';
        }

        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = langCode;
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        utterance.volume = (this.device.volume || 8) / 10;

        window.speechSynthesis.speak(utterance);

        this.device.lastSpokenText = speechText;
        this.device.lastSpokenTimestamp = new Date();
      } catch {
        // Fallback
      }
    }
    return true;
  }
}
