import React, { useState } from 'react';
import { Plane, Car, Hotel, Compass, X, CheckCircle2 } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { ListRow } from '../components/ListRow';
import { useApp } from '../state/AppContext';

interface TravelBooking {
  type: 'flight' | 'cab' | 'hotel' | 'holiday';
  title: string;
  subtitle: string;
  from?: string;
  to?: string;
  amount: number;
  provider: string;
}

export const TravelScreen: React.FC = () => {
  const { openPinModal, completePayment } = useApp();
  const [selectedBooking, setSelectedBooking] = useState<TravelBooking | null>(null);
  const [confirmedTicket, setConfirmedTicket] = useState<{
    title: string;
    pnr: string;
    amount: number;
    utr: string;
  } | null>(null);

  const bookings: TravelBooking[] = [
    {
      type: 'flight',
      title: 'Riyadh (RUH) ➔ Jeddah (JED)',
      subtitle: 'Saudia Flight • Direct • 1h 40m',
      from: 'Riyadh',
      to: 'Jeddah',
      amount: 490,
      provider: 'Saudia Airlines',
    },
    {
      type: 'cab',
      title: 'Airport Transfer Shuttle',
      subtitle: 'Premium Sedan • Doorstep Pickup',
      from: 'King Fahd Road',
      to: 'King Khalid Int. Airport (RUH)',
      amount: 120,
      provider: 'QTPay Mobility',
    },
    {
      type: 'hotel',
      title: 'Ritz-Carlton Riyadh',
      subtitle: 'Deluxe Suite • 1 Night • Breakfast Included',
      amount: 1200,
      provider: 'Ritz-Carlton Hotels',
    },
    {
      type: 'holiday',
      title: 'AlUla Heritage Getaway',
      subtitle: '3 Days / 2 Nights • Resort + Guided Safari',
      amount: 1990,
      provider: 'QTPay Holidays',
    },
  ];

  const handleStartBooking = (booking: TravelBooking) => {
    setSelectedBooking(booking);
  };

  const handleConfirmPay = () => {
    if (!selectedBooking) return;

    openPinModal({
      title: `Book ${selectedBooking.title}`,
      subTitle: `${selectedBooking.provider} • SAR ${selectedBooking.amount}`,
      amount: selectedBooking.amount,
      onSuccess: async () => {
        const txn = await completePayment({
          title: selectedBooking.title,
          subTitle: selectedBooking.provider,
          amount: selectedBooking.amount,
          category: 'Travel Booking',
        });

        const pnr = 'PNR' + Math.floor(100000 + Math.random() * 900000).toString();
        setConfirmedTicket({
          title: selectedBooking.title,
          pnr,
          amount: selectedBooking.amount,
          utr: txn.utr,
        });
        setSelectedBooking(null);
      },
    });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '30px' }}>
      <AppHeader title="Travel & Bookings" showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* Travel Desk Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(145deg, #0e274d 0%, #0a1c36 100%)',
            border: '1.5px solid rgba(46, 131, 255, 0.35)',
            borderRadius: '20px',
            padding: '24px 20px',
            marginBottom: '20px',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: '#eef5ff',
              color: '#2e83ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              border: '1.5px solid #d6e6ff',
            }}
          >
            <Plane size={26} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px 0', color: '#FFFFFF' }}>
            QPay Travel Desk
          </h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            Book flights, cabs, and hotels with zero convenience fee & instant UPI cashbacks
          </p>
        </div>

        <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginLeft: '4px' }}>
          Available Travel Bookings
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <ListRow
            icon={<Plane size={18} color="#2e83ff" />}
            label="Flight Bookings"
            subLabel="RUH ➔ JED • SAR 490 • Saudia"
            rightElement={<span style={{ fontSize: '12px', fontWeight: '800', color: '#2e83ff', backgroundColor: '#eef5ff', padding: '4px 10px', borderRadius: '8px' }}>Book SAR 490</span>}
            onClick={() => handleStartBooking(bookings[0])}
          />
          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0 16px' }} />
          <ListRow
            icon={<Car size={18} color="#2e83ff" />}
            label="Cab & Airport Bus"
            subLabel="Airport Pickup • SAR 120 • Sedan"
            rightElement={<span style={{ fontSize: '12px', fontWeight: '800', color: '#2e83ff', backgroundColor: '#eef5ff', padding: '4px 10px', borderRadius: '8px' }}>Book SAR 120</span>}
            onClick={() => handleStartBooking(bookings[1])}
          />
          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0 16px' }} />
          <ListRow
            icon={<Hotel size={18} color="#2e83ff" />}
            label="Hotel Reservations"
            subLabel="Ritz-Carlton Riyadh • SAR 1,200/night"
            rightElement={<span style={{ fontSize: '12px', fontWeight: '800', color: '#2e83ff', backgroundColor: '#eef5ff', padding: '4px 10px', borderRadius: '8px' }}>Reserve</span>}
            onClick={() => handleStartBooking(bookings[2])}
          />
          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0 16px' }} />
          <ListRow
            icon={<Compass size={18} color="#2e83ff" />}
            label="Holiday Packages"
            subLabel="AlUla 3D/2N Tour • SAR 1,990"
            rightElement={<span style={{ fontSize: '12px', fontWeight: '800', color: '#2e83ff', backgroundColor: '#eef5ff', padding: '4px 10px', borderRadius: '8px' }}>Explore</span>}
            onClick={() => handleStartBooking(bookings[3])}
          />
        </div>
      </div>

      {/* Booking Checkout Modal */}
      {selectedBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setSelectedBooking(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              padding: '24px 20px',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Confirm Booking
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>{selectedBooking.provider}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                aria-label="Close"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{selectedBooking.title}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{selectedBooking.subtitle}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Total Payable Amount</span>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#2e83ff', fontVariantNumeric: 'tabular-nums' }}>SAR {selectedBooking.amount.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmPay}
              className="interactive-tap"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#2e83ff',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              Pay SAR {selectedBooking.amount.toLocaleString()} via UPI PIN
            </button>
          </div>
        </div>
      )}

      {/* Confirmed Ticket Receipt Modal */}
      {confirmedTicket && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setConfirmedTicket(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center',
              position: 'relative',
              animation: 'scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#eef5ff',
                color: '#2e83ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                border: '1.5px solid #d6e6ff',
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
              Booking Confirmed!
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>{confirmedTicket.title}</p>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', textAlign: 'left', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Booking Reference (PNR)</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', fontFamily: 'monospace' }}>{confirmedTicket.pnr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Transaction UTR</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a', fontFamily: 'monospace' }}>{confirmedTicket.utr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed #cbd5e1' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Amount Paid</span>
                <span style={{ fontSize: '15px', fontWeight: '800', color: '#2e83ff', fontVariantNumeric: 'tabular-nums' }}>SAR {confirmedTicket.amount.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setConfirmedTicket(null)}
              className="interactive-tap"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#2e83ff',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              Done & View Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
