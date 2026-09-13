import React, { useState } from 'react';
import { ShoppingBag, Tag, ChevronRight, X, CheckCircle2, Copy } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { useApp } from '../state/AppContext';

interface DealItem {
  id: string;
  merchant: string;
  title: string;
  offer: string;
  category: string;
  couponCode: string;
  originalPrice: number;
  discountedPrice: number;
}

export const ShoppingScreen: React.FC = () => {
  const { openPinModal, completePayment } = useApp();
  const [selectedDeal, setSelectedDeal] = useState<DealItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [purchasedDeal, setPurchasedDeal] = useState<{
    title: string;
    merchant: string;
    paidAmount: number;
  } | null>(null);

  const deals: DealItem[] = [
    {
      id: 'deal-1',
      merchant: 'Tamimi Markets',
      title: 'Weekly Grocery Smart Saver',
      offer: 'Flat SAR 30 Cashback on UPI',
      category: 'Groceries & Essentials',
      couponCode: 'TAMIMI30',
      originalPrice: 250,
      discountedPrice: 220,
    },
    {
      id: 'deal-2',
      merchant: 'Fashion Hub Outlet',
      title: 'Trending Apparel Collection',
      offer: 'Flat SAR 50 Instant OFF',
      category: 'Clothing & Accessories',
      couponCode: 'FASHION50',
      originalPrice: 249,
      discountedPrice: 199,
    },
    {
      id: 'deal-3',
      merchant: 'Tech Zone Electronics',
      title: 'Wireless Noise Cancelling Earbuds',
      offer: 'Up to SAR 150 Instant Discount',
      category: 'Gadgets & Electronics',
      couponCode: 'TECHZONE150',
      originalPrice: 499,
      discountedPrice: 349,
    },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  const handleBuyNow = () => {
    if (!selectedDeal) return;

    openPinModal({
      title: `Buy ${selectedDeal.title}`,
      subTitle: `${selectedDeal.merchant} • SAR ${selectedDeal.discountedPrice}`,
      amount: selectedDeal.discountedPrice,
      onSuccess: async () => {
        await completePayment({
          title: selectedDeal.merchant,
          subTitle: selectedDeal.title,
          amount: selectedDeal.discountedPrice,
          category: 'Shopping Purchase',
        });

        setPurchasedDeal({
          title: selectedDeal.title,
          merchant: selectedDeal.merchant,
          paidAmount: selectedDeal.discountedPrice,
        });
        setSelectedDeal(null);
      },
    });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '30px' }}>
      <AppHeader title="Shopping & Deals" showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* Shopping Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(145deg, #0e274d 0%, #0a1c36 100%)',
            border: '1.5px solid rgba(46, 131, 255, 0.35)',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              backgroundColor: '#eef5ff',
              color: '#2e83ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1.5px solid #d6e6ff',
            }}
          >
            <ShoppingBag size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>QPay Partner Deals</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0 0' }}>
              Exclusive promo codes & instant discounts on top shopping brands
            </p>
          </div>
        </div>

        <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', marginLeft: '4px' }}>
          Featured Partner Offers
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {deals.map((deal) => (
            <div
              key={deal.id}
              onClick={() => setSelectedDeal(deal)}
              className="interactive-tap"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#eef5ff',
                    color: '#2e83ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #d6e6ff',
                  }}
                >
                  <Tag size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a' }}>{deal.merchant}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{deal.title}</div>
                  <div style={{ fontSize: '12px', color: '#2e83ff', marginTop: '3px', fontWeight: '800' }}>{deal.offer}</div>
                </div>
              </div>
              <ChevronRight size={18} color="#64748b" />
            </div>
          ))}
        </div>
      </div>

      {/* Deal Checkout Modal */}
      {selectedDeal && (
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
          onClick={() => setSelectedDeal(null)}
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
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{selectedDeal.merchant}</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>{selectedDeal.category}</p>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
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
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{selectedDeal.title}</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#2e83ff', marginTop: '4px' }}>
                {selectedDeal.offer}
              </div>

              {/* Coupon Copy Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '14px',
                  padding: '10px 14px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px dashed #2e83ff',
                  borderRadius: '12px',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Coupon Code</span>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', letterSpacing: '0.05em' }}>
                    {selectedDeal.couponCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(selectedDeal.couponCode)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: copiedCode ? '#0e274d' : '#2e83ff',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {copiedCode ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  {copiedCode ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Special Discount Price</span>
                <div>
                  <span style={{ fontSize: '13px', color: '#9CA3AF', textDecoration: 'line-through', marginRight: '8px', fontVariantNumeric: 'tabular-nums' }}>
                    SAR {selectedDeal.originalPrice.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                    SAR {selectedDeal.discountedPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBuyNow}
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
              Order Now via QPay UPI PIN (SAR {selectedDeal.discountedPrice.toLocaleString()})
            </button>
          </div>
        </div>
      )}

      {/* Confirmed Purchase Modal */}
      {purchasedDeal && (
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
          onClick={() => setPurchasedDeal(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
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
              Order Placed!
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px 0' }}>
              Discount voucher redeemed at {purchasedDeal.merchant}
            </p>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', textAlign: 'left', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{purchasedDeal.title}</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#2e83ff', marginTop: '6px', fontVariantNumeric: 'tabular-nums' }}>
                Paid SAR {purchasedDeal.paidAmount.toLocaleString()} via UPI
              </div>
            </div>

            <button
              onClick={() => setPurchasedDeal(null)}
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
              Done & View Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
