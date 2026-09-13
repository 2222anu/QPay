import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Flashlight,
  Image as ImageIcon,
  CheckCircle,
  Zap,
  Store,
  AlertCircle,
  Keyboard,
  User,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../state/AppContext';
import { designSystem } from '../design-system';
import { qrService } from '../services/qrService';

export const ScanScreen: React.FC = () => {
  const { isScanModalOpen, setIsScanModalOpen, contacts, navigateTo, transactions } = useApp();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [scanSuccessContact, setScanSuccessContact] = useState<any | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [showManualFallback, setShowManualFallback] = useState<boolean>(false);
  const [manualVpa, setManualVpa] = useState<string>('');
  const [duplicateWarning, setDuplicateWarning] = useState<{ isDuplicate: boolean; payee: string; amount: number } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Play scanner confirmation beep using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Start real camera stream
  useEffect(() => {
    if (!isScanModalOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setScanError(null);
      setShowManualFallback(false);
      setDuplicateWarning(null);
      return;
    }

    let isMounted = true;
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (isMounted) setHasCameraPermission(false);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setHasCameraPermission(true);
      } catch {
        if (isMounted) setHasCameraPermission(false);
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isScanModalOpen]);

  // Toggle Torch/Flashlight
  const toggleFlash = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as any;
      if (capabilities.torch) {
        try {
          const nextState = !isFlashOn;
          await (track as any).applyConstraints({ advanced: [{ torch: nextState }] });
          setIsFlashOn(nextState);
        } catch {
          // Torch not supported on this device
        }
      } else {
        setIsFlashOn(!isFlashOn);
      }
    }
  };

  // Trigger successful scan transition with duplicate protection check
  const handleScanSuccess = (contact: any, amount?: number, bypassDuplicateCheck = false) => {
    setScanError(null);

    // Duplicate transaction protection check
    if (!bypassDuplicateCheck && amount) {
      const dupCheck = qrService.checkDuplicateTransaction(contact.name || contact.upiId, amount, transactions);
      if (dupCheck.isDuplicate) {
        setDuplicateWarning({
          isDuplicate: true,
          payee: contact.name,
          amount,
        });
        return;
      }
    }

    setIsScanning(false);
    setScanSuccessContact(contact);
    playBeep();
    if (navigator.vibrate) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {}
    }

    setTimeout(() => {
      setIsScanModalOpen(false);
      setIsScanning(true);
      setScanSuccessContact(null);
      setDuplicateWarning(null);
      navigateTo('SEND_AMOUNT', { contact, defaultAmount: amount });
    }, 600);
  };

  // Test invalid QR format
  const handleTriggerInvalidQR = () => {
    setScanError('Invalid QR Code. Unsupported format or corrupted barcode. Please scan a valid UPI QR.');
    setTimeout(() => setScanError(null), 4000);
  };

  // Test expired dynamic QR
  const handleTriggerExpiredQR = () => {
    setScanError('This dynamic invoice QR code has expired. Please ask the merchant to generate a new QR.');
    setTimeout(() => setScanError(null), 4000);
  };

  // Image upload gallery handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate instant decoding of selected QR image
    const selectedContact = contacts[0] || {
      id: 'merchant-qr-1',
      name: 'Star Supermarket',
      upiId: 'starsupermarket@icici',
      avatarInitials: 'SS',
      isMerchant: true,
    };
    handleScanSuccess(selectedContact, 350);
  };

  // Manual fallback submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualVpa || !manualVpa.includes('@')) {
      setScanError('Please enter a valid UPI ID (e.g. name@upi).');
      return;
    }
    const contact = {
      id: `manual-${Date.now()}`,
      name: manualVpa.split('@')[0].toUpperCase(),
      upiId: manualVpa.toLowerCase().trim(),
      avatarInitials: manualVpa.substring(0, 2).toUpperCase(),
    };
    setShowManualFallback(false);
    handleScanSuccess(contact);
  };

  if (!isScanModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="QR Code Payment Scanner"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0a0f1d',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: designSystem.typography.fontFamily,
      }}
    >
      {/* Hidden file input for gallery upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'calc(16px + env(safe-area-inset-top, 0px)) 20px 16px 20px',
          zIndex: 20,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.85), transparent)',
        }}
      >
        <button
          onClick={() => setIsScanModalOpen(false)}
          aria-label="Close Scanner"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            color: '#FFFFFF',
            width: '40px',
            height: '40px',
            borderRadius: designSystem.radii.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          <X size={22} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '17px', fontWeight: '700', margin: 0 }}>
            Scan Any UPI QR
          </h2>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
            P2P &bull; P2M &bull; BharatQR
          </span>
        </div>

        <button
          onClick={toggleFlash}
          aria-label="Toggle Flashlight"
          style={{
            backgroundColor: isFlashOn ? designSystem.colors.primary : 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            color: '#FFFFFF',
            width: '40px',
            height: '40px',
            borderRadius: designSystem.radii.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'background-color 0.2s',
          }}
        >
          <Flashlight size={20} />
        </button>
      </div>

      {/* Viewfinder Center Camera Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '0 20px',
        }}
      >
        {/* Real Live Camera Stream View */}
        {hasCameraPermission && (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1,
            }}
          />
        )}

        {/* Viewfinder Target Box with Corner Reticles */}
        <div
          style={{
            width: 'min(270px, 75vw)',
            height: 'min(270px, 75vw)',
            borderRadius: '20px',
            position: 'relative',
            zIndex: 10,
            boxShadow: '0 0 0 4000px rgba(10, 15, 29, 0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: scanSuccessContact
              ? `3px solid ${designSystem.colors.success}`
              : scanError
              ? `3px solid #ef4444`
              : `1.5px solid rgba(46, 131, 255, 0.35)`,
            transition: 'border 0.3s ease',
          }}
        >
          {/* Corner Guides */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              width: 32,
              height: 32,
              borderTop: `4px solid ${scanError ? '#ef4444' : designSystem.colors.primary}`,
              borderLeft: `4px solid ${scanError ? '#ef4444' : designSystem.colors.primary}`,
              borderTopLeftRadius: '10px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 32,
              height: 32,
              borderTop: `4px solid ${scanError ? '#ef4444' : designSystem.colors.primary}`,
              borderRight: `4px solid ${scanError ? '#ef4444' : designSystem.colors.primary}`,
              borderTopRightRadius: '10px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              width: 32,
              height: 32,
              borderBottom: `4px solid ${scanError ? '#ef4444' : designSystem.colors.primary}`,
              borderLeft: `4px solid ${scanError ? '#ef4444' : designSystem.colors.primary}`,
              borderBottomLeftRadius: '10px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              width: 32,
              height: 32,
              borderBottom: `4px solid ${scanError ? '#ef4444' : designSystem.colors.primary}`,
              borderRight: `4px solid ${scanError ? '#ef4444' : designSystem.colors.primary}`,
              borderBottomRightRadius: '10px',
            }}
          />

          {/* Animated Laser Scanning Beam */}
          {isScanning && !scanError && (
            <div
              className="scanner-laser"
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: designSystem.colors.primary,
                position: 'absolute',
                boxShadow: `0 0 12px ${designSystem.colors.primary}, 0 0 4px #ffffff`,
                animation: 'scanLaser 2.2s infinite ease-in-out alternate',
              }}
            />
          )}

          {/* Scan Success Overlay */}
          {scanSuccessContact && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(16, 185, 129, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <CheckCircle size={48} color={designSystem.colors.success} />
              <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '15px' }}>
                {scanSuccessContact.isMerchant ? 'Merchant Verified (P2M)' : 'Recipient Verified (P2P)'}
              </span>
            </div>
          )}
        </div>

        {/* Scan Error Banner */}
        {scanError && (
          <div
            style={{
              marginTop: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.9)',
              border: '1px solid #fca5a5',
              borderRadius: '12px',
              padding: '10px 16px',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              zIndex: 15,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              maxWidth: '320px',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{scanError}</span>
          </div>
        )}

        {/* Duplicate Transaction Warning Modal Sheet */}
        {duplicateWarning && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(10, 15, 29, 0.95)',
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <Clock size={44} color="#f59e0b" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>
              Possible Duplicate Payment
            </h3>
            <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '20px', lineHeight: '1.4' }}>
              You recently paid SAR {duplicateWarning.amount} to {duplicateWarning.payee} less than a minute ago. Do you wish to proceed again?
            </p>
            <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '280px' }}>
              <button
                onClick={() => setDuplicateWarning(null)}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid #64748b',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleScanSuccess(duplicateWarning, duplicateWarning.amount, true)}
                style={{
                  flex: 1,
                  backgroundColor: '#2e83ff',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Pay Again
              </button>
            </div>
          </div>
        )}

        {/* Manual VPA Entry Drawer */}
        {showManualFallback && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(10, 15, 29, 0.95)',
              zIndex: 25,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Enter UPI ID Manually
              </h3>
              <button
                onClick={() => setShowManualFallback(false)}
                style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                value={manualVpa}
                onChange={(e) => setManualVpa(e.target.value)}
                placeholder="e.g. mobile@upi, merchant@icici"
                autoFocus
                style={{
                  backgroundColor: '#1e293b',
                  border: '1.5px solid #2e83ff',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#2e83ff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                Proceed <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Status Guide Text */}
        <p
          style={{
            color: '#e2e8f0',
            fontSize: '12px',
            marginTop: '16px',
            fontWeight: '600',
            zIndex: 10,
            textAlign: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            padding: '5px 14px',
            borderRadius: '20px',
            backdropFilter: 'blur(6px)',
          }}
        >
          {hasCameraPermission === false
            ? 'Camera preview restricted. Select a preset or use manual fallback below:'
            : 'Point camera at any QR code to pay instantly'}
        </p>

        {/* Test QR Presets Row (P2P, P2M, Dynamic, Expired, Invalid) */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '10px',
            zIndex: 10,
            overflowX: 'auto',
            maxWidth: '100%',
            padding: '4px',
          }}
        >
          {/* P2M Merchant Dynamic QR */}
          <button
            onClick={() =>
              handleScanSuccess(
                { id: 'm-1', name: 'Tamimi Markets', upiId: 'tamimi@alrajhi', avatarInitials: 'TM', isMerchant: true },
                280
              )
            }
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: designSystem.radii.sm,
              padding: '6px 12px',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Store size={13} color={designSystem.colors.primary} /> P2M Store (SAR 280)
          </button>

          {/* P2P Person Static QR */}
          <button
            onClick={() =>
              handleScanSuccess(
                { id: 'p2p-1', name: 'Tariq Al-Mansoor', upiId: 'tariq@snb', avatarInitials: 'TM', isMerchant: false }
              )
            }
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: designSystem.radii.sm,
              padding: '6px 12px',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <User size={13} color="#38bdf8" /> P2P Friend
          </button>

          {/* Expired QR Test */}
          <button
            onClick={handleTriggerExpiredQR}
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: designSystem.radii.sm,
              padding: '6px 10px',
              color: '#fca5a5',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Expired QR
          </button>

          {/* Invalid QR Test */}
          <button
            onClick={handleTriggerInvalidQR}
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: designSystem.radii.sm,
              padding: '6px 10px',
              color: '#fca5a5',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Invalid QR
          </button>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '18px 20px calc(18px + env(safe-area-inset-bottom, 0px)) 20px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: designSystem.radii.md,
              padding: '10px',
              minHeight: '44px',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <ImageIcon size={15} /> Upload
          </button>

          <button
            onClick={() => setShowManualFallback(true)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: designSystem.radii.md,
              padding: '10px',
              minHeight: '44px',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Keyboard size={15} /> Manual
          </button>

          <button
            onClick={() => handleScanSuccess(contacts[0] || { name: 'Priya Menon', upiId: 'priya@paytm' })}
            style={{
              backgroundColor: designSystem.colors.primary,
              border: 'none',
              borderRadius: designSystem.radii.md,
              padding: '10px',
              minHeight: '44px',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: designSystem.shadows.none,
            }}
          >
            <Zap size={15} /> Demo Pay
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scanLaser {
          0% { top: 6%; }
          100% { top: 94%; }
        }
      `}</style>
    </div>
  );
};
