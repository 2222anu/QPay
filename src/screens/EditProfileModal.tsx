import React, { useState, useEffect, useRef } from 'react';
import { X, User as UserIcon, Phone, Mail, AtSign, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { designSystem } from '../design-system';

interface EditProfileModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const COLOR_PRESETS = [
  { name: 'Electric Blue', color: '#2e83ff' },
  { name: 'Midnight Navy', color: '#071529' },
  { name: 'Deep Sapphire', color: '#0e274d' },
  { name: 'Cyber Cyan', color: '#38bdf8' },
  { name: 'Royal Blue', color: '#1d4ed8' },
  { name: 'Slate Navy', color: '#334155' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const { user, updateUser, isEditProfileModalOpen, setIsEditProfileModalOpen } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOpen = propIsOpen !== undefined ? propIsOpen : isEditProfileModalOpen;
  const handleClose = () => {
    if (propOnClose) propOnClose();
    setIsEditProfileModalOpen(false);
  };

  const [name, setName] = useState(user.name);
  const [mobile, setMobile] = useState(user.mobile);
  const [upiId, setUpiId] = useState(user.upiId);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [avatarBgColor, setAvatarBgColor] = useState(user.avatarBgColor || designSystem.colors.primary);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setMobile(user.mobile);
      setUpiId(user.upiId);
      setEmail(user.email);
      setAvatarUrl(user.avatarUrl || '');
      setAvatarBgColor(user.avatarBgColor || designSystem.colors.primary);
      setErrorMsg('');
      setSuccessMsg(false);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, user]);

  if (!isOpen) return null;

  const previewInitials = name
    .trim()
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'QT';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!mobile.trim() || mobile.trim().length < 10) {
      setErrorMsg('Please enter a valid mobile number');
      return;
    }
    if (!upiId.trim() || !upiId.includes('@')) {
      setErrorMsg('Please enter a valid UPI ID (e.g. name@qtpay)');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    updateUser({
      name: name.trim(),
      mobile: mobile.trim(),
      upiId: upiId.trim(),
      email: email.trim(),
      avatarUrl: avatarUrl || undefined,
      avatarBgColor,
    });

    setSuccessMsg(true);
    setTimeout(() => {
      handleClose();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: designSystem.colors.overlay,
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={handleClose}
    >
      <div
        className="fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: designSystem.colors.surface,
          border: `1px solid ${designSystem.colors.borderHairline}`,
          borderRadius: designSystem.radii.lg,
          padding: '24px',
          boxShadow: designSystem.shadows.none,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 id="edit-profile-title" style={{ fontSize: '18px', fontWeight: designSystem.typography.weights.extrabold, color: designSystem.colors.textPrimary }}>
            Edit Profile Details
          </h3>
          <button
            onClick={handleClose}
            aria-label="Close edit profile modal"
            style={{
              backgroundColor: designSystem.colors.subSurface,
              border: 'none',
              color: designSystem.colors.textSecondary,
              width: '32px',
              height: '32px',
              borderRadius: designSystem.radii.full,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: designSystem.shadows.none,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Profile Header Preview */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px',
            backgroundColor: designSystem.colors.background,
            borderRadius: designSystem.radii.md,
            marginBottom: '20px',
            border: `1px solid ${designSystem.colors.borderHairline}`,
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: designSystem.radii.full,
                backgroundColor: avatarBgColor,
                color: designSystem.colors.textOnPrimary,
                fontWeight: designSystem.typography.weights.extrabold,
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: `2px solid ${designSystem.colors.surface}`,
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                previewInitials
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload photo"
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '24px',
                height: '24px',
                borderRadius: designSystem.radii.full,
                backgroundColor: designSystem.colors.primary,
                color: designSystem.colors.textOnPrimary,
                border: `2px solid ${designSystem.colors.surface}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: designSystem.shadows.none,
              }}
              title="Upload Profile Picture"
            >
              <Camera size={12} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '16px', fontWeight: designSystem.typography.weights.extrabold, color: designSystem.colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name || 'Your Name'}
            </div>
            <div style={{ fontSize: '12px', color: designSystem.colors.primary, fontWeight: designSystem.typography.weights.bold, marginTop: '2px' }}>
              {upiId || 'upi@qtpay'} &bull; {mobile || '+966...'}
            </div>
          </div>
        </div>

        {/* Color Presets */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', fontWeight: designSystem.typography.weights.bold, color: designSystem.colors.textSecondary, display: 'block', marginBottom: '8px' }}>
            Choose Avatar Color Theme
          </span>
          <div role="radiogroup" aria-label="Avatar Color Presets" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.color}
                type="button"
                role="radio"
                aria-checked={avatarBgColor === preset.color && !avatarUrl}
                aria-label={preset.name}
                onClick={() => {
                  setAvatarBgColor(preset.color);
                  setAvatarUrl('');
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: designSystem.radii.full,
                  backgroundColor: preset.color,
                  border: avatarBgColor === preset.color && !avatarUrl ? `3px solid ${designSystem.colors.textPrimary}` : `2px solid ${designSystem.colors.surface}`,
                  cursor: 'pointer',
                  boxShadow: designSystem.shadows.none,
                  transition: 'transform 0.15s ease',
                  transform: avatarBgColor === preset.color && !avatarUrl ? 'scale(1.15)' : 'scale(1)',
                }}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: designSystem.radii.md,
              backgroundColor: designSystem.colors.dangerLight,
              border: `1px solid ${designSystem.colors.dangerLight}`,
              color: designSystem.colors.danger,
              fontSize: '13px',
              fontWeight: designSystem.typography.weights.semibold,
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        {successMsg ? (
          <div style={{ padding: '30px 0', textAlign: 'center' }}>
            <CheckCircle2 size={48} color={designSystem.colors.primary} style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '16px', fontWeight: designSystem.typography.weights.extrabold, color: designSystem.colors.textPrimary, margin: 0 }}>Profile Updated Successfully!</h4>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Name */}
            <div>
              <label htmlFor="edit-name-input" style={{ fontSize: '12px', fontWeight: designSystem.typography.weights.bold, color: designSystem.colors.textSecondary, display: 'block', marginBottom: '6px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: designSystem.colors.primary }} />
                <input
                  id="edit-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: designSystem.radii.md,
                    border: `1px solid ${designSystem.colors.borderStrong}`,
                    backgroundColor: designSystem.colors.surface,
                    fontSize: '14px',
                    fontWeight: designSystem.typography.weights.bold,
                    color: designSystem.colors.textPrimary,
                    boxShadow: designSystem.shadows.none,
                  }}
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="edit-mobile-input" style={{ fontSize: '12px', fontWeight: designSystem.typography.weights.bold, color: designSystem.colors.textSecondary, display: 'block', marginBottom: '6px' }}>
                Mobile Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: designSystem.colors.primary }} />
                <input
                  id="edit-mobile-input"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter mobile number"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: designSystem.radii.md,
                    border: `1px solid ${designSystem.colors.borderStrong}`,
                    backgroundColor: designSystem.colors.surface,
                    fontSize: '14px',
                    fontWeight: designSystem.typography.weights.bold,
                    color: designSystem.colors.textPrimary,
                    boxShadow: designSystem.shadows.none,
                  }}
                />
              </div>
            </div>

            {/* UPI ID */}
            <div>
              <label htmlFor="edit-upi-input" style={{ fontSize: '12px', fontWeight: designSystem.typography.weights.bold, color: designSystem.colors.textSecondary, display: 'block', marginBottom: '6px' }}>
                Primary UPI ID
              </label>
              <div style={{ position: 'relative' }}>
                <AtSign size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: designSystem.colors.primary }} />
                <input
                  id="edit-upi-input"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@qtpay"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: designSystem.radii.md,
                    border: `1px solid ${designSystem.colors.borderStrong}`,
                    backgroundColor: designSystem.colors.surface,
                    fontSize: '14px',
                    fontWeight: designSystem.typography.weights.bold,
                    color: designSystem.colors.textPrimary,
                    boxShadow: designSystem.shadows.none,
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="edit-email-input" style={{ fontSize: '12px', fontWeight: designSystem.typography.weights.bold, color: designSystem.colors.textSecondary, display: 'block', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: designSystem.colors.primary }} />
                <input
                  id="edit-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: designSystem.radii.md,
                    border: `1px solid ${designSystem.colors.borderStrong}`,
                    backgroundColor: designSystem.colors.surface,
                    fontSize: '14px',
                    fontWeight: designSystem.typography.weights.bold,
                    color: designSystem.colors.textPrimary,
                    boxShadow: designSystem.shadows.none,
                  }}
                />
              </div>
            </div>

            {/* Save Action Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: designSystem.colors.primary,
                color: designSystem.colors.textOnPrimary,
                border: 'none',
                borderRadius: designSystem.radii.md,
                padding: '14px',
                fontWeight: designSystem.typography.weights.extrabold,
                fontSize: '15px',
                cursor: 'pointer',
                marginTop: '10px',
                boxShadow: designSystem.shadows.none,
              }}
            >
              Save Profile Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
