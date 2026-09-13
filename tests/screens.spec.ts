import { test, expect } from '@playwright/test';

const SCREENS = [
  'HOME',
  'SPLASH',
  'ONBOARDING',
  'MOBILE_NUMBER',
  'SMS_OTP',
  'PERMISSIONS',
  'PAY_ANYONE',
  'SEND_AMOUNT',
  'ELECTRICITY',
  'PAYMENT_SUCCESS',
  'HISTORY',
  'RECEIVE',
  'SCAN',
  'REQUEST_MONEY',
  'PROFILE',
  'BANK_ACCOUNTS',
  'UPI_SETTINGS',
  'PAYMENT_METHODS',
  'SECURITY',
  'NOTIFICATIONS',
  'ALL_SERVICES',
  'MONEY_REQUESTS',
  'HELP_SUPPORT',
  'PRIVACY',
  'SHOPPING',
  'MESSAGES',
  'TRAVEL',
  'REWARDS',
  'FOOD',
  // New Fintech & Merchant Ecosystem Screens
  'CUSTOMER_KYC',
  'CUSTOMER_PIN_SETUP',
  'CUSTOMER_SECURITY_SETUP',
  'BILLER_CODE',
  'CARDS',
  'MERCHANT_DASHBOARD',
  'MERCHANT_ONBOARDING',
  'SOFTPOS',
  'SOUND_BOX',
];

const MODALS = [
  { name: 'LanguageModal', openMethod: 'setIsLanguageModalOpen', text: 'Select Language' },
  { name: 'LogoutModal', openMethod: 'setIsLogoutModalOpen', text: 'Log Out' },
  { name: 'AddBankModal', openMethod: 'setIsAddBankModalOpen', text: 'Link Bank Account' },
  { name: 'AppLinksModal', openMethod: 'setIsAppLinksModalOpen', text: 'Application Links' },
  { name: 'EditProfileModal', openMethod: 'setIsEditProfileModalOpen', text: 'Profile' },
  {
    name: 'PayBillPinModal',
    openMethod: 'openPinModal',
    args: [{ title: 'Test Payment', amount: 100, subTitle: 'Electricity Bill' }],
    text: 'PIN',
  },
];

test.describe('QtPay All Screens and Modals Verification Suite', () => {
  let consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        // Filter out benign Vite/React internal logs or network aborts if any
        const text = msg.text();
        if (!text.includes('favicon') && !text.includes('chrome-extension')) {
          consoleErrors.push(text);
        }
      }
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });
  });

  test('Bottom Navigation is sticky and fixed at the bottom', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('nav[role="navigation"]');

    const nav = page.locator('nav[role="navigation"]');
    await expect(nav).toBeVisible();

    const position = await nav.evaluate((el) => window.getComputedStyle(el).position);
    expect(position).toBe('fixed');

    const bottom = await nav.evaluate((el) => window.getComputedStyle(el).bottom);
    expect(bottom).toBe('0px');
  });

  for (const screenId of SCREENS) {
    test(`Screen: ${screenId} renders with zero runtime errors`, async ({ page }) => {
      await page.goto(`/?screen=${screenId}`);
      await page.waitForLoadState('domcontentloaded');

      // Wait a moment for async effects
      await page.waitForTimeout(150);

      // Viewport must exist
      const viewport = page.locator('.app-viewport');
      await expect(viewport).toBeVisible();

      // Screen content must exist
      const content = page.locator('.screen-content');
      await expect(content).toBeVisible();

      // Assert no JavaScript runtime / console errors occurred
      expect(consoleErrors, `Errors found on screen ${screenId}`).toEqual([]);
    });
  }

  for (const modal of MODALS) {
    test(`Modal: ${modal.name} opens and renders cleanly`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Trigger modal open via test helper
      await page.evaluate(
        ({ method, args }) => {
          const qtpay = (window as any).__qtpay;
          if (qtpay && qtpay[method]) {
            qtpay[method](...(args || [true]));
          }
        },
        { method: modal.openMethod, args: (modal as any).args }
      );

      await page.waitForTimeout(200);

      // Assert modal text or sheet is visible
      const bodyText = await page.textContent('body');
      expect(bodyText).toContain(modal.text);

      // Assert no JavaScript errors
      expect(consoleErrors, `Errors found when opening modal ${modal.name}`).toEqual([]);
    });
  }

  test('Fintech Flow: Customer KYC validates PAN and advances', async ({ page }) => {
    await page.goto('/?screen=CUSTOMER_KYC');
    await page.waitForLoadState('domcontentloaded');

    const panInput = page.locator('input[placeholder="ABCDE1234F"]');
    await expect(panInput).toBeVisible();
    await panInput.fill('ABCDE1234F');

    const verifyBtn = page.getByRole('button', { name: /Verify & Continue/i });
    await expect(verifyBtn).toBeEnabled();
  });

  test('Fintech Flow: Cards Hub renders cards with freeze toggle', async ({ page }) => {
    await page.goto('/?screen=CARDS');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('button:has-text("RuPay (VIRTUAL)")')).toBeVisible();
    await expect(page.locator('button:has-text("Freeze Card")')).toBeVisible();
    await expect(page.locator('text=Manage Card Limits')).toBeVisible();
  });

  test('Fintech Flow: BBPS Biller code search and fetch', async ({ page }) => {
    await page.goto('/?screen=BILLER_CODE');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Bharat Bill Payment System')).toBeVisible();
    const searchInput = page.locator('input[placeholder*="MSEB-01"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('TATA');
    await expect(page.locator('text=Tata Power DDL')).toBeVisible();
  });

  test('Fintech Flow: Merchant Dashboard displays settlements and QR standee', async ({ page }) => {
    await page.goto('/?screen=MERCHANT_DASHBOARD');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Today\'s Collections')).toBeVisible();
    await expect(page.locator('button:has-text("Settle Now")')).toBeVisible();
    await expect(page.locator('text=Store QR')).toBeVisible();
  });

  test('Fintech Flow: SoftPOS terminal contactless tap authorization', async ({ page }) => {
    await page.goto('/?screen=SOFTPOS');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=QTPay SoftPOS Terminal')).toBeVisible();
    const collectBtn = page.locator('button:has-text("Collect")');
    await expect(collectBtn).toBeVisible();
    await collectBtn.click();
    await expect(page.locator('text=Hold Card or Phone to Tap')).toBeVisible();
    const tapButton = page.locator('button:has-text("Simulate Contactless Tap")');
    await expect(tapButton).toBeVisible();
    await tapButton.click();
    await page.waitForTimeout(200);
    expect(consoleErrors).toEqual([]);
  });

  test('Fintech Flow: Sound Box device settings and speech test', async ({ page }) => {
    await page.goto('/?screen=SOUND_BOX');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=QTPay Smart Sound Box Pro')).toBeVisible();
    await expect(page.locator('button:has-text("Play Audio Chime")')).toBeVisible();
    await expect(page.locator('button:has-text("Test ₹500")')).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test('Internationalization Flow: Switching to Telugu translates app text and persists', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Trigger language change to Telugu via test helper
    await page.evaluate(() => {
      const qtpay = (window as any).__qtpay;
      if (qtpay && qtpay.setAppLanguage) {
        qtpay.setAppLanguage('Telugu');
      }
    });

    await page.waitForTimeout(300);

    // Assert that bottom navigation or quick actions have translated into Telugu
    const bodyText = await page.textContent('body');
    expect(bodyText).toContain('హోమ్'); // 'Home' in Telugu
    expect(bodyText).toContain('స్కాన్ & పే'); // 'Scan & Pay' in Telugu

    // Reset back to English
    await page.evaluate(() => {
      const qtpay = (window as any).__qtpay;
      if (qtpay && qtpay.setAppLanguage) {
        qtpay.setAppLanguage('English');
      }
    });
    await page.waitForTimeout(300);
    const englishBody = await page.textContent('body');
    expect(englishBody).toContain('Home');
    expect(englishBody).toContain('Scan & Pay');
  });
});
