import { create } from 'zustand';
import { AuthState, User } from '@/types';

// Mock user data (will be replaced with API calls)
const mockUser: User = {
  id: 'user-1',
  fullName: 'Ahmed Al-Saud',
  email: 'ahmed@example.com',
  phone: '+966 55 123 4567',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
  language: 'en',
  vehicles: [
    { id: 'veh-1', plate: 'ABC 1234', make: 'Toyota', model: 'Camry', type: 'sedan', color: '#1E293B', isDefault: true },
    { id: 'veh-2', plate: 'XYZ 5678', make: 'Tesla', model: 'Model 3', type: 'sedan', color: '#3B82F6', isDefault: false },
  ],
  paymentMethods: [
    { id: 'pm-1', type: 'card', last4: '4242', brand: 'Visa', isDefault: true },
    { id: 'pm-2', type: 'stc_pay', last4: '', brand: 'STC Pay', isDefault: false },
    { id: 'pm-3', type: 'mada', last4: '9876', brand: 'Mada', isDefault: false },
  ],
  savedLotIds: ['lot-1', 'lot-3'],
  createdAt: new Date('2025-01-15'),
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (email && password) {
      set({ user: mockUser, isAuthenticated: true });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  register: async (data: Partial<User> & { password: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (data.email && data.password) {
      set({
        user: { ...mockUser, ...data, id: 'user-new', createdAt: new Date() },
        isAuthenticated: true,
      });
    } else {
      throw new Error('Registration failed');
    }
  },
}));
