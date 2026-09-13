import React, { useState } from 'react';
import {
  Zap,
  Droplets,
  Flame,
  Smartphone,
  PhoneCall,
  Globe,
  Tv,
  CreditCard,
  ShieldCheck,
  Building,
  Plane,
  Car,
  Gift,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { ServiceCard } from '../components/ServiceCard';
import { Modal } from '../components/Modal';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../state/AppContext';

export const AllServicesScreen: React.FC = () => {
  const { navigateTo, openPinModal, completePayment } = useApp();

  const [selectedService, setSelectedService] = useState<{
    title: string;
    subTitle: string;
    defaultAmount: number;
    placeholder: string;
    icon: React.ReactNode;
  } | null>(null);

  const [accountNumber, setAccountNumber] = useState<string>('9876543210');
  const [amount, setAmount] = useState<string>('');

  const handleOpenService = (
    title: string,
    subTitle: string,
    defaultAmount: number,
    placeholder: string,
    icon: React.ReactNode
  ) => {
    setSelectedService({ title, subTitle, defaultAmount, placeholder, icon });
    setAmount(defaultAmount.toString());
  };

  const handleProceedPayment = () => {
    if (!selectedService) return;
    const payAmt = parseFloat(amount) || selectedService.defaultAmount;
    const serviceTitle = selectedService.title;
    const serviceSubTitle = `${selectedService.subTitle} (${accountNumber})`;

    const modalTitle = serviceTitle;
    const modalSubTitle = serviceSubTitle;

    setSelectedService(null);

    openPinModal({
      title: modalTitle,
      amount: payAmt,
      subTitle: modalSubTitle,
      onSuccess: () => {
        completePayment({
          title: serviceTitle,
          subTitle: serviceSubTitle,
          amount: payAmt,
          category: 'Bill Payment',
        }).then((txn) => {
          navigateTo('PAYMENT_SUCCESS', { transaction: txn });
        });
      },
    });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '24px' }}>
      <AppHeader title="All Services" showBack showSettings />

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* BBPS Biller Code Action Banner */}
        <div
          onClick={() => navigateTo('BILLER_CODE')}
          className="interactive-tap"
          style={{
            background: 'linear-gradient(135deg, #071529 0%, #0a2540 60%, #1d4ed8 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '16px',
            padding: '16px 18px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(46, 131, 255, 0.25)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>Pay by Biller Code</div>
              <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>
                Instant bill fetch across 20,000+ national BBPS billers
              </div>
            </div>
          </div>
          <div
            style={{
              backgroundColor: '#2e83ff',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 800,
            }}
          >
            Search
          </div>
        </div>

        {/* Bill Payments Grid */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginLeft: '4px' }}>
            Recharge & Bill Payments
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <ServiceCard label="Electricity" icon={<Zap size={20} />} onClick={() => navigateTo('ELECTRICITY')} />
              <ServiceCard
                label="Water"
                icon={<Droplets size={20} />}
                onClick={() => handleOpenService('Water Bill', 'Municipal Water Supply', 480, 'Enter Consumer ID', <Droplets size={24} />)}
              />
              <ServiceCard
                label="Piped Gas"
                icon={<Flame size={20} />}
                onClick={() => handleOpenService('Piped Gas Bill', 'Adani / Gujarat Gas', 750, 'Enter Customer No', <Flame size={20} />)}
              />
              <ServiceCard
                label="LPG Cylinder"
                icon={<Flame size={20} />}
                onClick={() => handleOpenService('LPG Cylinder Booking', 'Indane / HP Gas', 850, 'Enter Consumer No or Mobile', <Flame size={20} />)}
              />
              <ServiceCard
                label="Mobile Prepaid"
                icon={<Smartphone size={20} />}
                onClick={() => handleOpenService('Mobile Prepaid Recharge', 'Jio / Airtel Unlimited Pack', 666, 'Enter 10-digit Mobile Number', <Smartphone size={20} />)}
              />
              <ServiceCard
                label="Mobile Postpaid"
                icon={<PhoneCall size={20} />}
                onClick={() => handleOpenService('Mobile Postpaid Bill', 'Airtel / Vi Postpaid', 1199, 'Enter Mobile / Account No', <PhoneCall size={20} />)}
              />
              <ServiceCard
                label="Broadband"
                icon={<Globe size={20} />}
                onClick={() => handleOpenService('Broadband Bill', 'Airtel Xstream / JioFiber', 999, 'Enter Account / Fixedline No', <Globe size={20} />)}
              />
              <ServiceCard
                label="DTH / TV"
                icon={<Tv size={20} />}
                onClick={() => handleOpenService('DTH Recharge', 'Tata Play / Airtel DTH', 450, 'Enter Subscriber ID or Mobile', <Tv size={20} />)}
              />
            </div>
          </div>
        </div>

        {/* Financial Services */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginLeft: '4px' }}>
            Financial & Insurance
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <ServiceCard label="Credit Card" icon={<CreditCard size={20} />} onClick={() => navigateTo('PAYMENT_METHODS')} />
              <ServiceCard
                label="Insurance"
                icon={<ShieldCheck size={20} />}
                onClick={() => handleOpenService('Insurance Premium', 'Tawuniya / Bupa Arabia Insurance', 3450, 'Enter Policy Number', <ShieldCheck size={20} />)}
              />
              <ServiceCard
                label="Loan Repay"
                icon={<Building size={20} />}
                onClick={() => handleOpenService('Loan EMI Repayment', 'Al Rajhi / SNB Finance EMI', 4200, 'Enter Loan Account Number', <Building size={20} />)}
              />
              <ServiceCard
                label="Road Tolls"
                icon={<Car size={20} />}
                onClick={() => handleOpenService('Parking & Road Tolls', 'Mawaqif / Regional Toll Tag', 150, 'Enter Vehicle Plate Number', <Car size={20} />)}
              />
            </div>
          </div>
        </div>

        {/* Travel & Bookings */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginLeft: '4px' }}>
            Travel & Entertainment
          </div>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <ServiceCard
                label="Flights"
                icon={<Plane size={20} />}
                onClick={() => handleOpenService('Flight Booking', 'IndiGo Delhi to Mumbai', 4850, 'Enter Passenger PNR / Booking ID', <Plane size={20} />)}
              />
              <ServiceCard
                label="Gift Cards"
                icon={<Gift size={20} />}
                onClick={() => handleOpenService('Brand Gift Card', 'Amazon / Flipkart Voucher', 1000, 'Enter Recipient Mobile / Email', <Gift size={20} />)}
              />
              <ServiceCard
                label="Tax Pay"
                icon={<FileText size={20} />}
                onClick={() => handleOpenService('Property / Advance Tax', 'Municipal Tax Payment', 2400, 'Enter Assessment / Challan No', <FileText size={20} />)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Bill Payment Input Modal */}
      {selectedService && (
        <Modal
          isOpen={Boolean(selectedService)}
          onClose={() => setSelectedService(null)}
          title={selectedService.title}
        >
          <div style={{ padding: '4px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#eef5ff',
                  color: '#2e83ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #d6e6ff',
                }}
              >
                {selectedService.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{selectedService.title}</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>{selectedService.subTitle}</p>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="modal-acc-input" style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }}>
                Account / Consumer Number
              </label>
              <input
                id="modal-acc-input"
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={selectedService.placeholder}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label htmlFor="modal-amt-input" style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }}>
                Payment Amount (SAR)
              </label>
              <input
                id="modal-amt-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #2e83ff',
                  fontSize: '20px',
                  fontWeight: '900',
                  color: '#2e83ff',
                  outline: 'none',
                  fontVariantNumeric: 'tabular-nums',
                }}
              />
            </div>

            <PrimaryButton onClick={handleProceedPayment}>
              Proceed to Pay <CheckCircle size={18} />
            </PrimaryButton>
          </div>
        </Modal>
      )}
    </div>
  );
};
