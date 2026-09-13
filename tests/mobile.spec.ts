import { test, expect } from '@playwright/test';

const MOBILE_VIEWPORTS = [
  { name: 'Compact Android (360x740)', width: 360, height: 740 },
  { name: 'iPhone SE (375x667)', width: 375, height: 667 },
  { name: 'iPhone 13/14 (390x844)', width: 390, height: 844 },
  { name: 'Pixel 7 (412x915)', width: 412, height: 915 },
];

const KEY_MOBILE_SCREENS = [
  'HOME',
  'SMS_OTP',
  'MOBILE_NUMBER',
  'SEND_AMOUNT',
  'RECEIVE',
  'HISTORY',
  'CARDS',
  'MERCHANT_DASHBOARD',
  'SOFTPOS',
  'ALL_SERVICES',
  'BANK_ACCOUNTS',
];

test.describe('Mobile Viewports & Touch Experience Verification Suite', () => {
  for (const vp of MOBILE_VIEWPORTS) {
    test.describe(`Viewport: ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      let consoleErrors: string[] = [];

      test.beforeEach(async ({ page }) => {
        consoleErrors = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
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

      for (const screenId of KEY_MOBILE_SCREENS) {
        test(`Screen ${screenId} has NO horizontal overflow (scrollWidth <= ${vp.width})`, async ({ page }) => {
          await page.goto(`/?screen=${screenId}`);
          await page.waitForLoadState('domcontentloaded');
          await page.waitForTimeout(200);

          // Check document and app-viewport horizontal overflow
          const overflowCheck = await page.evaluate(() => {
            const docWidth = document.documentElement.scrollWidth;
            const bodyWidth = document.body.scrollWidth;
            const innerW = window.innerWidth;
            const appViewport = document.querySelector('.app-viewport');
            const viewportScrollW = appViewport ? appViewport.scrollWidth : 0;
            const viewportClientW = appViewport ? appViewport.clientWidth : 0;

            return {
              docWidth,
              bodyWidth,
              innerW,
              viewportScrollW,
              viewportClientW,
              hasDocOverflow: docWidth > innerW,
              hasBodyOverflow: bodyWidth > innerW,
              hasViewportOverflow: viewportScrollW > viewportClientW + 1, // 1px subpixel tolerance
            };
          });

          expect(overflowCheck.hasDocOverflow, `Document has horizontal overflow on ${screenId} (${overflowCheck.docWidth}px > ${overflowCheck.innerW}px)`).toBe(false);
          expect(overflowCheck.hasBodyOverflow, `Body has horizontal overflow on ${screenId} (${overflowCheck.bodyWidth}px > ${overflowCheck.innerW}px)`).toBe(false);
          expect(overflowCheck.hasViewportOverflow, `App viewport has horizontal overflow on ${screenId} (${overflowCheck.viewportScrollW}px > ${overflowCheck.viewportClientW}px)`).toBe(false);

          expect(consoleErrors, `Errors found on screen ${screenId}`).toEqual([]);
        });
      }

      test('Primary and Secondary buttons maintain comfortable touch target (>= 44px)', async ({ page }) => {
        await page.goto('/?screen=MOBILE_NUMBER');
        await page.waitForLoadState('domcontentloaded');

        const primaryBtn = page.locator('button:has-text("Get OTP Verification Code")');
        await expect(primaryBtn).toBeVisible();
        const box = await primaryBtn.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      });

      test('Modals open as mobile bottom sheet with drag handle', async ({ page }) => {
        await page.goto('/?screen=CARDS');
        await page.waitForLoadState('domcontentloaded');

        // Click Limits tool to open limits modal
        const limitsTool = page.locator('text=Manage Card Limits');
        await expect(limitsTool).toBeVisible();
        await limitsTool.click();

        // Check modal container
        const modalContainer = page.locator('.modal-container');
        await expect(modalContainer).toBeVisible();

        // Drag handle should be visible on mobile viewport
        const dragHandle = page.locator('.mobile-drag-handle');
        await expect(dragHandle).toBeVisible();

        // Close modal button
        const closeBtn = page.locator('.modal-close-btn');
        await expect(closeBtn).toBeVisible();
        const closeBox = await closeBtn.boundingBox();
        expect(closeBox).not.toBeNull();
        if (closeBox) {
          expect(closeBox.width).toBeGreaterThanOrEqual(36);
          expect(closeBox.height).toBeGreaterThanOrEqual(36);
        }
      });

      test('End-to-End Mobile Merchant Journey: Mobile -> OTP -> Merchant Selection -> Setup -> SoftPOS -> Success', async ({ page }) => {
        // 1. Mobile Number entry
        await page.goto('/?screen=MOBILE_NUMBER');
        await page.waitForLoadState('domcontentloaded');
        const getOtpBtn = page.locator('button:has-text("Get OTP Verification Code")');
        await expect(getOtpBtn).toBeVisible();
        await getOtpBtn.click();

        // 2. OTP Verification Screen
        const verifyBtn = page.locator('button:has-text("Verify & Continue")');
        await expect(verifyBtn).toBeVisible();
        await verifyBtn.click();

        // 3. Account Type Selector Modal
        const merchantChoice = page.locator('text=Merchant Business');
        await expect(merchantChoice).toBeVisible();
        await merchantChoice.click();

        // 4. Merchant Setup Screen
        const continueBankBtn = page.locator('button:has-text("Continue to Settlement Bank")');
        await expect(continueBankBtn).toBeVisible();
        await continueBankBtn.click();

        const continuePinBtn = page.locator('button:has-text("Continue to PIN Setup")');
        await expect(continuePinBtn).toBeVisible();
        await continuePinBtn.click();

        // 5. Merchant PIN Setup Step (1234)
        for (const num of ['1', '2', '3', '4']) {
          await page.locator(`button:has-text("${num}")`).first().click();
        }
        await page.waitForTimeout(250);
        // Confirm 4 digits (1234)
        for (const num of ['1', '2', '3', '4']) {
          await page.locator(`button:has-text("${num}")`).first().click();
        }

        // 6. Review & Activate
        const activateBtn = page.locator('button:has-text("Activate & Enter Merchant Dashboard")');
        await expect(activateBtn).toBeVisible();
        await activateBtn.click();

        // 7. Merchant Dashboard
        await page.waitForTimeout(1000);
        const softposBtn = page.locator('text=Collect via SoftPOS');
        await expect(softposBtn).toBeVisible();
        await softposBtn.click();

        // 8. SoftPOS Terminal
        const collectBtn = page.locator('button:has-text("Collect SAR")');
        await expect(collectBtn).toBeVisible();
        await collectBtn.click();

        const simulateTapBtn = page.locator('button:has-text("Simulate Contactless Tap")');
        await expect(simulateTapBtn).toBeVisible();
        await simulateTapBtn.click();

        // 9. Payment Received
        const successTitle = page.locator('text=Payment Received');
        await expect(successTitle).toBeVisible({ timeout: 6000 });

        const doneBtn = page.locator('button:has-text("Done")');
        await expect(doneBtn).toBeVisible();
        await doneBtn.click();

        // 10. Returned to Merchant Dashboard Collections
        await expect(page.locator('text=Recent Collections Log')).toBeVisible();
      });
    });
  }
});
