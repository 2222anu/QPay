import React, { useState } from 'react';
import { HelpCircle, MessageSquare, PhoneCall, ChevronDown, ChevronUp, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { ListRow } from '../components/ListRow';
import { Modal } from '../components/Modal';

export const HelpSupportScreen: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'chat' | 'call' | 'dispute' | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    { sender: 'agent', text: 'Hello! How can I assist you with your QTPay account today?', time: 'Just now' },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [disputeSuccess, setDisputeSuccess] = useState(false);
  const [disputeTxnId, setDisputeTxnId] = useState('');
  const [disputeReason, setDisputeReason] = useState('');

  const faqs = [
    { q: 'How long does a UPI refund take?', a: 'Instant UPI refunds are usually credited within 1-2 hours. In rare bank network delays, it can take up to 24-48 hours.' },
    { q: 'What is the daily transfer limit?', a: 'As per SAMA banking guidelines, the standard daily instant payment limit is SAR 20,000 to SAR 100,000 depending on your account tier.' },
    { q: 'How do I add a new bank account?', a: 'Go to Profile > Bank Accounts > tap Add Bank, select your bank, and verify your mobile number via SMS.' },
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: 'Just now' },
    ]);
    setInputMsg('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'agent', text: `Thanks for contacting us regarding "${userText}". A support supervisor has received your message and will update your ticket within 5 minutes.`, time: 'Just now' },
      ]);
    }, 1000);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisputeSuccess(true);
    setTimeout(() => {
      setDisputeSuccess(false);
      setActiveModal(null);
      setDisputeTxnId('');
      setDisputeReason('');
    }, 1500);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f9', minHeight: '100%', paddingBottom: '36px' }}>
      <AppHeader title="Help & Support" showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        {/* Priority Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #071529 0%, #0a2540 55%, #1d4ed8 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '20px',
            padding: '24px 20px',
            marginBottom: '22px',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(10, 25, 47, 0.2)',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <HelpCircle size={28} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px', color: '#FFFFFF', margin: 0 }}>
            24/7 Priority Concierge
          </h3>
          <p style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.75)', marginTop: '6px', marginBottom: 0 }}>
            Instant dispute resolution and customer assistance
          </p>
        </div>

        <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', marginLeft: '4px' }}>
          Assistance Channels
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)' }}>
          <ListRow
            icon={<MessageSquare size={18} color="#2e83ff" />}
            label="Live Chat with Support"
            subLabel="Avg response time: ~1 minute"
            onClick={() => setActiveModal('chat')}
          />
          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0 16px' }} />
          <ListRow
            icon={<PhoneCall size={18} color="#2e83ff" />}
            label="Toll-Free Hotline"
            subLabel="1800-123-QTPAY (78729)"
            onClick={() => setActiveModal('call')}
          />
          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0 16px' }} />
          <ListRow
            icon={<ShieldAlert size={18} color="#2e83ff" />}
            label="Report Dispute or Fraud"
            subLabel="File a formal transaction complaint"
            onClick={() => setActiveModal('dispute')}
          />
        </div>

        {/* FAQs */}
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', marginLeft: '4px' }}>
          Frequently Asked Questions
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div
                key={index}
                className="interactive-tap"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                }}
                onClick={() => setExpandedFaq(isExpanded ? null : index)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>{faq.q}</span>
                  {isExpanded ? <ChevronUp size={16} color="#2e83ff" /> : <ChevronDown size={16} color="#64748b" />}
                </div>
                {isExpanded && (
                  <p style={{ fontSize: '12.5px', color: '#475569', marginTop: '10px', marginBottom: 0, lineHeight: '1.5', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Chat Modal */}
      <Modal isOpen={activeModal === 'chat'} onClose={() => setActiveModal(null)} title="Live Customer Support">
        <div style={{ height: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px', paddingRight: '4px' }}>
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#2e83ff' : '#f1f5f9',
                color: msg.sender === 'user' ? '#FFFFFF' : '#0f172a',
                padding: '10px 14px',
                borderRadius: '14px',
                maxWidth: '80%',
                fontSize: '13px',
                fontWeight: '600',
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type your question..."
            style={{ flex: 1, padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
          />
          <button
            type="submit"
            className="interactive-tap"
            style={{ backgroundColor: '#2e83ff', border: 'none', color: '#FFFFFF', padding: '0 16px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}
          >
            <Send size={16} />
          </button>
        </form>
      </Modal>

      {/* Hotline Call Modal */}
      <Modal isOpen={activeModal === 'call'} onClose={() => setActiveModal(null)} title="Toll-Free Customer Hotline">
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
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
              margin: '0 auto 14px auto',
              border: '1.5px solid #d6e6ff',
            }}
          >
            <PhoneCall size={28} />
          </div>
          <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>1800-123-QTPAY</h4>
          <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 20px 0' }}>Available 24x7 in English, Telugu, Hindi and Tamil</p>
          <a
            href="tel:180012378729"
            className="interactive-tap"
            style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: '#2e83ff', color: '#FFFFFF', borderRadius: '12px', fontWeight: 800, fontSize: '13px', textDecoration: 'none' }}
          >
            Call Now
          </a>
        </div>
      </Modal>

      {/* Report Dispute Modal */}
      <Modal isOpen={activeModal === 'dispute'} onClose={() => setActiveModal(null)} title="Report Transaction Dispute">
        {disputeSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={44} color="#2e83ff" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Dispute Ticket Filed Successfully!</h4>
            <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Ticket ID: #QT-DISP-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
        ) : (
          <form onSubmit={handleDisputeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                Transaction UTR / ID
              </label>
              <input
                type="text"
                value={disputeTxnId}
                onChange={(e) => setDisputeTxnId(e.target.value)}
                placeholder="e.g. UTR984729104821"
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                Reason for Dispute
              </label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Describe what went wrong with the transaction..."
                rows={3}
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
              />
            </div>

            <button
              type="submit"
              className="interactive-tap"
              style={{
                marginTop: '8px',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#0e274d',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 800,
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              Submit Formal Dispute
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
};
