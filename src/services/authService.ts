import type { User } from '../types';

export const authService = {
  async getCurrentUser(): Promise<User> {
    return {
      name: 'Anu',
      avatarInitials: 'AN',
      upiId: 'anu@qtpay',
      mobile: '+966 50 123 4567',
      email: 'anu@qtpay.com',
    };
  },
  async verifyPin(pin: string): Promise<boolean> {
    // Mock PIN validation: any 4 digit pin is valid for demo
    return pin.length === 4;
  },
};
