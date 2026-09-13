import { MockSoundBoxProvider } from './providers/mockAdapters';
import type { SoundBoxDevice } from '../types/fintech';

const soundBoxProvider = new MockSoundBoxProvider();

export const soundBoxService = {
  async getStatus(): Promise<SoundBoxDevice> {
    return soundBoxProvider.getDeviceStatus();
  },

  async updateSettings(settings: Partial<SoundBoxDevice>): Promise<SoundBoxDevice> {
    return soundBoxProvider.updateSettings(settings);
  },

  async playTestSound(): Promise<boolean> {
    return soundBoxProvider.playTestChime();
  },

  async announcePayment(amount: number, language?: string): Promise<boolean> {
    const currentDevice = await soundBoxProvider.getDeviceStatus();
    const lang = language || currentDevice.language;
    return soundBoxProvider.announcePayment(amount, lang);
  },
};
