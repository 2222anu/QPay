import React from 'react';
import { AppProvider, useApp } from './state/AppContext';
import { BottomNavigation } from './components/BottomNavigation';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { MobileNumberScreen } from './screens/MobileNumberScreen';
import { SmsOtpScreen } from './screens/SmsOtpScreen';
import { PermissionsScreen } from './screens/PermissionsScreen';
import { HomeScreen } from './screens/HomeScreen';
import { PayAnyoneScreen } from './screens/PayAnyoneScreen';
import { SendAmountScreen } from './screens/SendAmountScreen';
import { ElectricityScreen } from './screens/ElectricityScreen';
import { PaymentSuccessScreen } from './screens/PaymentSuccessScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ReceiveScreen } from './screens/ReceiveScreen';
import { ScanScreen } from './screens/ScanScreen';
import { RequestMoneyScreen } from './screens/RequestMoneyScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BankAccountsScreen } from './screens/BankAccountsScreen';
import { UPISettingsScreen } from './screens/UPISettingsScreen';
import { PaymentMethodsScreen } from './screens/PaymentMethodsScreen';
import { SecurityScreen } from './screens/SecurityScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { AllServicesScreen } from './screens/AllServicesScreen';
import { MoneyRequestsScreen } from './screens/MoneyRequestsScreen';
import { HelpSupportScreen } from './screens/HelpSupportScreen';
import { PrivacyScreen } from './screens/PrivacyScreen';

// Lifestyle Screens
import { ShoppingScreen } from './screens/ShoppingScreen';
import { MessagesScreen } from './screens/MessagesScreen';
import { TravelScreen } from './screens/TravelScreen';
import { RewardsScreen } from './screens/RewardsScreen';
import { FoodScreen } from './screens/FoodScreen';

// Fintech & Merchant Enhancement Screens
import { CustomerKycScreen } from './screens/CustomerKycScreen';
import { CustomerPinSetupScreen } from './screens/CustomerPinSetupScreen';
import { CustomerSecuritySetupScreen } from './screens/CustomerSecuritySetupScreen';
import { BillerCodeScreen } from './screens/BillerCodeScreen';
import { CardsScreen } from './screens/CardsScreen';
import { MerchantDashboardScreen } from './screens/MerchantDashboardScreen';
import { MerchantOnboardingScreen } from './screens/MerchantOnboardingScreen';
import { SoftPosScreen } from './screens/SoftPosScreen';
import { SoundBoxScreen } from './screens/SoundBoxScreen';

// Modals
import { PayBillPinModal } from './screens/PayBillPinModal';
import { LanguageModal } from './screens/LanguageModal';
import { LogoutModal } from './screens/LogoutModal';
import { AddBankModal } from './screens/AddBankModal';
import { AppLinksModal } from './screens/AppLinksModal';
import { EditProfileModal } from './screens/EditProfileModal';

const AppContent: React.FC = () => {
  const { currentScreen, isRtl } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'SPLASH':
        return <SplashScreen />;
      case 'ONBOARDING':
        return <OnboardingScreen />;
      case 'MOBILE_NUMBER':
        return <MobileNumberScreen />;
      case 'SMS_OTP':
        return <SmsOtpScreen />;
      case 'PERMISSIONS':
        return <PermissionsScreen />;
      case 'CUSTOMER_KYC':
        return <CustomerKycScreen />;
      case 'CUSTOMER_PIN_SETUP':
        return <CustomerPinSetupScreen />;
      case 'CUSTOMER_SECURITY_SETUP':
        return <CustomerSecuritySetupScreen />;
      case 'HOME':
        return <HomeScreen />;
      case 'PAY_ANYONE':
        return <PayAnyoneScreen />;
      case 'SEND_AMOUNT':
        return <SendAmountScreen />;
      case 'ELECTRICITY':
        return <ElectricityScreen />;
      case 'PAYMENT_SUCCESS':
        return <PaymentSuccessScreen />;
      case 'HISTORY':
        return <HistoryScreen />;
      case 'RECEIVE':
        return <ReceiveScreen />;
      case 'REQUEST_MONEY':
        return <RequestMoneyScreen />;
      case 'PROFILE':
        return <ProfileScreen />;
      case 'BANK_ACCOUNTS':
        return <BankAccountsScreen />;
      case 'UPI_SETTINGS':
        return <UPISettingsScreen />;
      case 'PAYMENT_METHODS':
        return <PaymentMethodsScreen />;
      case 'CARDS':
        return <CardsScreen />;
      case 'BILLER_CODE':
        return <BillerCodeScreen />;
      case 'MERCHANT_DASHBOARD':
        return <MerchantDashboardScreen />;
      case 'MERCHANT_ONBOARDING':
        return <MerchantOnboardingScreen />;
      case 'SOFTPOS':
        return <SoftPosScreen />;
      case 'SOUND_BOX':
        return <SoundBoxScreen />;
      case 'SECURITY':
        return <SecurityScreen />;
      case 'NOTIFICATIONS':
        return <NotificationsScreen />;
      case 'ALL_SERVICES':
        return <AllServicesScreen />;
      case 'MONEY_REQUESTS':
        return <MoneyRequestsScreen />;
      case 'HELP_SUPPORT':
        return <HelpSupportScreen />;
      case 'PRIVACY':
        return <PrivacyScreen />;
      case 'SHOPPING':
        return <ShoppingScreen />;
      case 'MESSAGES':
        return <MessagesScreen />;
      case 'TRAVEL':
        return <TravelScreen />;
      case 'REWARDS':
        return <RewardsScreen />;
      case 'FOOD':
        return <FoodScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const showBottomNav =
    currentScreen !== 'SPLASH' &&
    currentScreen !== 'ONBOARDING' &&
    currentScreen !== 'MOBILE_NUMBER' &&
    currentScreen !== 'SMS_OTP' &&
    currentScreen !== 'PERMISSIONS' &&
    currentScreen !== 'CUSTOMER_KYC' &&
    currentScreen !== 'CUSTOMER_PIN_SETUP' &&
    currentScreen !== 'CUSTOMER_SECURITY_SETUP' &&
    currentScreen !== 'MERCHANT_ONBOARDING' &&
    currentScreen !== 'PAYMENT_SUCCESS';

  return (
    <div className={`app-viewport ${isRtl ? 'rtl' : ''}`}>
      {/* Scrollable Main Screen Container */}
      <div className="screen-content">{renderScreen()}</div>

      {/* Global Fixed Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}

      {/* Camera / QR Scanner Viewfinder Screen Overlay */}
      <ScanScreen />

      {/* Bottom Sheet Modals */}
      <PayBillPinModal />
      <LanguageModal />
      <LogoutModal />
      <AddBankModal />
      <AppLinksModal />
      <EditProfileModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
