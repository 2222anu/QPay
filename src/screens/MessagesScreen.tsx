import React, { useState } from 'react';
import { Send, X, Shield, CheckCheck } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';

interface ChatThread {
  id: string;
  name: string;
  avatarInitials: string;
  isSupport?: boolean;
  messages: { sender: 'me' | 'them'; text: string; time: string }[];
  time: string;
  unread: boolean;
}

export const MessagesScreen: React.FC = () => {
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'chat-1',
      name: 'QTPay Support Bot',
      avatarInitials: 'QT',
      isSupport: true,
      time: '10:42 AM',
      unread: true,
      messages: [
        { sender: 'them', text: 'Hello Anu! Welcome to QTPay 24/7 Support.', time: '10:40 AM' },
        { sender: 'them', text: 'Your electricity bill payment of SAR 2,620.14 was successful. UTR: 948201849204', time: '10:42 AM' },
      ],
    },
    {
      id: 'chat-2',
      name: 'Al Rajhi Bank Official',
      avatarInitials: 'AR',
      isSupport: true,
      time: '10:41 AM',
      unread: false,
      messages: [
        { sender: 'them', text: 'Alert: A/c ****4012 debited by SAR 2,620.14 on 10-Sep-26. Info: QTPay SEC Electricity.', time: '10:41 AM' },
      ],
    },
    {
      id: 'chat-3',
      name: 'Tariq Al-Mansoor',
      avatarInitials: 'TM',
      time: 'Yesterday',
      unread: false,
      messages: [
        { sender: 'me', text: 'Sent you SAR 500 for dinner split!', time: 'Yesterday 8:30 PM' },
        { sender: 'them', text: 'Thanks for the quick transfer Anu! Got it.', time: 'Yesterday 8:32 PM' },
      ],
    },
  ]);

  const [activeChat, setActiveChat] = useState<ChatThread | null>(null);
  const [inputText, setInputText] = useState('');

  const handleOpenChat = (thread: ChatThread) => {
    setActiveChat(thread);
    // Mark as read
    setThreads((prev) =>
      prev.map((t) => (t.id === thread.id ? { ...t, unread: false } : t))
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const newMsg = {
      sender: 'me' as const,
      text: inputText.trim(),
      time: 'Just now',
    };

    const updatedMessages = [...activeChat.messages, newMsg];
    setActiveChat({ ...activeChat, messages: updatedMessages });

    setThreads((prev) =>
      prev.map((t) => (t.id === activeChat.id ? { ...t, messages: updatedMessages, time: 'Just now' } : t))
    );

    setInputText('');

    // Simulated Auto-Reply if Support
    if (activeChat.isSupport) {
      setTimeout(() => {
        const replyMsg = {
          sender: 'them' as const,
          text: 'Thank you for your message! Our automated support system has logged your query.',
          time: 'Just now',
        };
        setActiveChat((curr) => (curr && curr.id === activeChat.id ? { ...curr, messages: [...curr.messages, replyMsg] } : curr));
      }, 1000);
    }
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '30px' }}>
      <AppHeader title="Messages & Alerts" showBack showSettings={false} />

      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', marginLeft: '4px' }}>
          Conversations & System Alerts
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => handleOpenChat(thread)}
              className="interactive-tap"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#FFFFFF',
                border: thread.unread ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                borderRadius: '16px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: thread.isSupport ? '#0e274d' : '#2e83ff',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  {thread.avatarInitials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a' }}>{thread.name}</span>
                    {thread.isSupport && <Shield size={14} color="#2e83ff" />}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {thread.messages[thread.messages.length - 1]?.text}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: thread.unread ? '#2e83ff' : '#64748b', marginLeft: '10px' }}>
                {thread.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Interactive Chat Modal Window */}
      {activeChat && (
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
          onClick={() => setActiveChat(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '85vh',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Window Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#0e274d',
                color: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#2e83ff',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {activeChat.avatarInitials}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF' }}>{activeChat.name}</div>
                  <div style={{ fontSize: '11px', color: '#82b5ff' }}>Online • QPay Messaging</div>
                </div>
              </div>
              <button
                onClick={() => setActiveChat(null)}
                aria-label="Close"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f8fafc' }}>
              {activeChat.messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    backgroundColor: msg.sender === 'me' ? '#2e83ff' : '#FFFFFF',
                    color: msg.sender === 'me' ? '#FFFFFF' : '#0f172a',
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'me' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    border: msg.sender === 'me' ? 'none' : '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: '600', lineHeight: '1.45' }}>{msg.text}</div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: msg.sender === 'me' ? 'rgba(255,255,255,0.8)' : '#64748b',
                      textAlign: 'right',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '4px',
                    }}
                  >
                    {msg.time}
                    {msg.sender === 'me' && <CheckCheck size={12} />}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Send Input Box */}
            <form onSubmit={handleSendMessage} style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', backgroundColor: '#FFFFFF', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '20px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="interactive-tap"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#2e83ff',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
