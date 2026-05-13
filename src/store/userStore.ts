import { create } from 'zustand';
import { UserState } from '@/types';

export const useUserStore = create<UserState>((set, get) => ({
  savedLotIds: ['lot-1', 'lot-3'],
  toggleSavedLot: (lotId: string) => {
    const current = get().savedLotIds;
    if (current.includes(lotId)) {
      set({ savedLotIds: current.filter((id) => id !== lotId) });
    } else {
      set({ savedLotIds: [...current, lotId] });
    }
  },
  isSaved: (lotId: string) => {
    return get().savedLotIds.includes(lotId);
  },
}));
