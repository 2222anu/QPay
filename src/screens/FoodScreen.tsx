import React, { useState } from 'react';
import { Utensils, Star, X, CheckCircle2, Clock, Plus, Minus } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { useApp } from '../state/AppContext';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface Restaurant {
  id: string;
  name: string;
  rating: string;
  cuisine: string;
  offer: string;
  deliveryTime: string;
  items: MenuItem[];
}

export const FoodScreen: React.FC = () => {
  const { openPinModal, completePayment } = useApp();
  const [selectedRes, setSelectedRes] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderConfirmed, setOrderConfirmed] = useState<{
    restaurantName: string;
    totalAmount: number;
    estimatedTime: string;
  } | null>(null);

  const restaurants: Restaurant[] = [
    {
      id: 'res-1',
      name: 'Cafe Aroma & Bakery',
      rating: '4.8',
      cuisine: 'Coffee, Fresh Pastries & Italian Breakfast',
      offer: 'Flat 20% OFF with QTPAY20',
      deliveryTime: '20-25 mins',
      items: [
        { id: 'i-1', name: 'Hazelnut Iced Latte', price: 210, qty: 1 },
        { id: 'i-2', name: 'Avocado Toast & Poached Egg', price: 280, qty: 1 },
        { id: 'i-3', name: 'Belgian Chocolate Croissant', price: 160, qty: 0 },
      ],
    },
    {
      id: 'res-2',
      name: 'Royal Biryani House',
      rating: '4.9',
      cuisine: 'Hyderabadi Dum Biryani & Kebabs',
      offer: 'Free Chicken Tikka Starter on orders > SAR 100',
      deliveryTime: '30-35 mins',
      items: [
        { id: 'i-4', name: 'Special Mutton Dum Biryani', price: 420, qty: 1 },
        { id: 'i-5', name: 'Chicken 65 Starter', price: 290, qty: 1 },
        { id: 'i-6', name: 'Double Ka Meetha Dessert', price: 120, qty: 0 },
      ],
    },
    {
      id: 'res-3',
      name: 'Green Bowl Eatery',
      rating: '4.7',
      cuisine: 'Healthy Bowls, Smoothies & Salads',
      offer: '15% Cashback on QTPay UPI',
      deliveryTime: '25-30 mins',
      items: [
        { id: 'i-7', name: 'Protein Loaded Quinoa Bowl', price: 340, qty: 1 },
        { id: 'i-8', name: 'Berry Blast Smoothie', price: 190, qty: 1 },
      ],
    },
  ];

  const handleOpenRes = (res: Restaurant) => {
    setSelectedRes(res);
    setMenuItems(res.items.map((it) => ({ ...it })));
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(0, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const calculateSubtotal = () => {
    return menuItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const handlePlaceOrder = () => {
    if (!selectedRes) return;
    const total = calculateSubtotal();
    if (total <= 0) return;

    openPinModal({
      title: `Order from ${selectedRes.name}`,
      subTitle: `Food Delivery • ${selectedRes.deliveryTime}`,
      amount: total,
      onSuccess: async () => {
        await completePayment({
          title: selectedRes.name,
          subTitle: `Food Order (${menuItems.filter((i) => i.qty > 0).length} items)`,
          amount: total,
          category: 'Food & Dining',
        });

        setOrderConfirmed({
          restaurantName: selectedRes.name,
          totalAmount: total,
          estimatedTime: selectedRes.deliveryTime,
        });
        setSelectedRes(null);
      },
    });
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '30px' }}>
      <AppHeader title="Food & Dining" showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* Dining Offer Banner */}
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
            <Utensils size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>QPay Food & Dining</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '3px 0 0 0' }}>
              Order food online with instant QPay discounts & 0 delivery fee
            </p>
          </div>
        </div>

        <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', marginLeft: '4px' }}>
          Nearby Partner Restaurants
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {restaurants.map((res) => (
            <div
              key={res.id}
              onClick={() => handleOpenRes(res)}
              className="interactive-tap"
              style={{
                padding: '16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{res.name}</h4>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    backgroundColor: '#ecfdf5',
                    color: '#10b981',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid #a7f3d0',
                  }}
                >
                  <Star size={12} fill="#10b981" /> {res.rating}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{res.cuisine}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#2e83ff', backgroundColor: '#eef5ff', padding: '3px 8px', borderRadius: '6px' }}>
                  {res.offer}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                  <Clock size={12} /> {res.deliveryTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Restaurant Menu & Checkout Modal */}
      {selectedRes && (
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
          onClick={() => setSelectedRes(null)}
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
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{selectedRes.name}</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>Select items to order</p>
              </div>
              <button
                onClick={() => setSelectedRes(null)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a' }}>{item.name}</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#2e83ff', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                      SAR {item.price}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => handleUpdateQty(item.id, -1)}
                      className="interactive-tap"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#0f172a',
                      }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: '14px', fontWeight: '800', minWidth: '16px', textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(item.id, 1)}
                      className="interactive-tap"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: '#2e83ff',
                        border: 'none',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Total Bill Amount</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#2e83ff', fontVariantNumeric: 'tabular-nums' }}>
                SAR {calculateSubtotal().toLocaleString()}
              </span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={calculateSubtotal() <= 0}
              className="interactive-tap"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: calculateSubtotal() > 0 ? '#2e83ff' : '#cbd5e1',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '800',
                cursor: calculateSubtotal() > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Order & Pay SAR {calculateSubtotal().toLocaleString()} via UPI PIN
            </button>
          </div>
        </div>
      )}

      {/* Confirmed Order Delivery Tracking Modal */}
      {orderConfirmed && (
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
          onClick={() => setOrderConfirmed(null)}
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
              Order Confirmed!
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px 0' }}>
              {orderConfirmed.restaurantName} is preparing your meal
            </p>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px', textAlign: 'left', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Clock size={16} color="#2e83ff" />
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#2e83ff' }}>
                  Delivering in {orderConfirmed.estimatedTime}
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                Paid SAR {orderConfirmed.totalAmount} via QPay UPI
              </div>
            </div>

            <button
              onClick={() => setOrderConfirmed(null)}
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
              Track Order Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
