import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  BatteryCharging,
  Radio,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Globe,
  Sliders,
} from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { useApp } from '../state/AppContext';
import { soundBoxService } from '../services/soundBoxService';
import type { SoundBoxDevice } from '../types/fintech';

export const SoundBoxScreen: React.FC = () => {
  const { navigateTo } = useApp();

  const [device, setDevice] = useState<SoundBoxDevice>({
    deviceId: 'SB-QTPAY-984',
    name: 'QTPay Smart Sound Box Pro',
    model: 'SB-2026-4G',
    connectionState: 'CONNECTED',
    batteryLevel: 94,
    networkSignal: '4G_LTE',
    volume: 8,
    language: 'Hindi',
  });

  const [isPlayingTest, setIsPlayingTest] = useState<boolean>(false);
  const [lastAnnouncement, setLastAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    soundBoxService.getStatus().then(setDevice);
  }, []);

  const handleVolumeChange = async (vol: number) => {
    const updated = await soundBoxService.updateSettings({ volume: vol });
    setDevice(updated);
  };

  const handleLanguageChange = async (lang: 'Arabic' | 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Marathi') => {
    const updated = await soundBoxService.updateSettings({ language: lang });
    setDevice(updated);
  };

  const handleTestChime = async () => {
    setIsPlayingTest(true);
    await soundBoxService.playTestSound();
    setIsPlayingTest(false);
  };

  const handleSimulatePayment = async (amount: number) => {
    setLastAnnouncement(`Announcing SAR ${amount} in ${device.language}...`);
    await soundBoxService.announcePayment(amount, device.language);
    setTimeout(() => {
      setLastAnnouncement(`Announced: "${device.language === 'Arabic' ? `تم استلام ${amount} ريال عبر كيو تي باي` : `QTPay received ${amount} SAR`}"`);
    }, 400);
  };

  const toggleConnection = async () => {
    const nextState = device.connectionState === 'CONNECTED' ? 'OFFLINE' : 'CONNECTED';
    const updated = await soundBoxService.updateSettings({ connectionState: nextState });
    setDevice(updated);
  };

  return (
    <div className="fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100%', paddingBottom: '36px' }}>
      <AppHeader title="Sound Box Manager" showBack onBack={() => navigateTo('MERCHANT_DASHBOARD')} />

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Sound Box Device Showcase Card */}
        <div
          style={{
            background: device.connectionState === 'OFFLINE'
              ? 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
              : 'linear-gradient(135deg, #071529 0%, #0a2540 50%, #1d4ed8 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '20px',
            padding: '24px 20px',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Sound Box Speaker Mesh Visual */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              marginBottom: '14px',
              position: 'relative',
            }}
          >
            <Volume2 size={40} />
            {device.connectionState === 'CONNECTED' && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#34d399',
                }}
              />
            )}
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 4px 0' }}>
            {device.name}
          </h2>
          <div style={{ fontSize: '12px', color: '#82b5ff', fontWeight: 700, fontFamily: 'monospace' }}>
            ID: {device.deviceId} &bull; Model: {device.model}
          </div>

          {/* Status Indicators Pill Row */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Radio size={13} color={device.connectionState === 'CONNECTED' ? '#34d399' : '#ef4444'} />
              <span>{device.connectionState === 'CONNECTED' ? '4G LTE Connected' : 'Offline'}</span>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <BatteryCharging size={13} color="#38bdf8" />
              <span>{device.batteryLevel}% Battery</span>
            </div>
          </div>
        </div>

        {/* Offline Warning if disconnected */}
        {device.connectionState === 'OFFLINE' && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '14px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#991b1b',
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>Sound Box is offline. Connect device to 4G/Wi-Fi to receive audio announcements.</span>
          </div>
        )}

        {/* Device Settings Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* Volume Control */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} color="#2e83ff" />
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Broadcast Volume</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#2e83ff' }}>
                Level {device.volume}/10
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <VolumeX size={16} color="#64748b" />
              <input
                type="range"
                min={1}
                max={10}
                value={device.volume}
                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#2e83ff', cursor: 'pointer' }}
              />
              <Volume2 size={16} color="#2e83ff" />
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />

          {/* Announcement Language */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Globe size={16} color="#2e83ff" />
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>Announcement Language</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['Arabic', 'English', 'Hindi', 'Tamil', 'Telugu', 'Marathi'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className="interactive-tap"
                  style={{
                    backgroundColor: device.language === lang ? '#eef5ff' : '#f8fafc',
                    border: device.language === lang ? '1.5px solid #2e83ff' : '1px solid #e2e8f0',
                    color: device.language === lang ? '#2e83ff' : '#0f172a',
                    borderRadius: '12px',
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Audio Test & Payment Simulation */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Instant Audio Verification Test
          </div>

          <PrimaryButton onClick={handleTestChime} disabled={isPlayingTest}>
            <Play size={16} /> Play Audio Chime
          </PrimaryButton>

          {/* Simulate Payment Announcements */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => handleSimulatePayment(100)}
              className="interactive-tap"
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
              }}
            >
              Test SAR 100
            </button>
            <button
              onClick={() => handleSimulatePayment(500)}
              className="interactive-tap"
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
              }}
            >
              Test SAR 500
            </button>
            <button
              onClick={() => handleSimulatePayment(1200)}
              className="interactive-tap"
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
              }}
            >
              Test SAR 1,200
            </button>
          </div>

          {lastAnnouncement && (
            <div
              className="fade-in"
              style={{
                backgroundColor: '#eef5ff',
                border: '1px solid #d6e6ff',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#2e83ff',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{lastAnnouncement}</span>
            </div>
          )}
        </div>

        {/* Offline / Online Diagnostic Toggle */}
        <SecondaryButton onClick={toggleConnection}>
          <RotateCcw size={16} /> {device.connectionState === 'CONNECTED' ? 'Test Disconnected Mode' : 'Reconnect Sound Box'}
        </SecondaryButton>
      </div>
    </div>
  );
};
