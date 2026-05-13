'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Car,
  CreditCard,
  Heart,
  Globe,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Plus,
  Edit3,
  Trash2,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';
import { mockUser, mockParkingLots } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { savedLotIds } = useUserStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const currentUser = user || mockUser;
  const savedLots = mockParkingLots.filter((l) => savedLotIds.includes(l.id));

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const sections = [
    {
      title: 'My Vehicles',
      icon: Car,
      items: currentUser.vehicles.map((v) => ({
        label: `${v.make} ${v.model}`,
        subtitle: `${v.plate} · ${v.type}`,
        action: () => toast.success('Vehicle details'),
      })),
      addAction: () => toast.success('Add vehicle form'),
    },
    {
      title: 'Payment Methods',
      icon: CreditCard,
      items: currentUser.paymentMethods.map((p) => ({
        label: p.type === 'stc_pay' ? 'STC Pay' : `${p.brand} •••• ${p.last4}`,
        subtitle: p.isDefault ? 'Default' : '',
        action: () => toast.success('Payment details'),
      })),
      addAction: () => toast.success('Add payment method'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 glass-effect border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Profile</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* User Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="text-center py-6">
            <div className="relative inline-block">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-20 h-20 rounded-full mx-auto bg-gray-200 dark:bg-gray-700"
              />
              <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                <Edit3 size={12} />
              </button>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-3">{currentUser.fullName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
              <Mail size={12} /> {currentUser.email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-0.5">
              <Phone size={12} /> {currentUser.phone}
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <Badge variant="info" size="sm">
                {currentUser.vehicles.length} Vehicles
              </Badge>
              <Badge variant="success" size="sm">
                {savedLots.length} Saved
              </Badge>
            </div>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Settings</h3>
            <div className="space-y-1">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                      {theme === 'dark' ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} className="text-gray-600" />}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{theme === 'dark' ? 'On' : 'Off'}</p>
                    </div>
                  </div>
                  <div className={`w-10 h-6 rounded-full transition-colors relative ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${theme === 'dark' ? 'left-5' : 'left-1'}`} />
                  </div>
                </button>
              )}

              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <Globe size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Language</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">English</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <Bell size={16} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Notifications</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Push, Email</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <Lock size={16} className="text-red-600 dark:text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Change Password</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Update your password</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Vehicles & Payment Methods */}
        {sections.map((section, sectionIndex) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + sectionIndex * 0.1 }}>
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <section.icon size={16} className="text-blue-600" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                </div>
                <button onClick={section.addAction} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Plus size={14} className="text-blue-600" />
                </button>
              </div>
              <div className="space-y-1">
                {section.items.map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                      {item.subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.subtitle === 'Default' && <Badge variant="info" size="sm">Default</Badge>}
                      <button onClick={(e) => { e.stopPropagation(); toast.success('Edit'); }} className="p-1 hover:text-blue-600">
                        <Edit3 size={12} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); toast.success('Deleted'); }} className="p-1 hover:text-red-600">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Saved Lots */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Heart size={16} className="text-red-500" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Saved Lots ({savedLots.length})</h3>
            </div>
            {savedLots.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-2">No saved parking lots yet</p>
            ) : (
              <div className="space-y-2">
                {savedLots.map((lot) => (
                  <button
                    key={lot.id}
                    onClick={() => router.push(`/lot/${lot.id}`)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <img src={lot.photoUrls[0]} alt={lot.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{lot.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SAR {lot.pricePerHour}/hr · {lot.availableSlots} spots</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Button variant="danger" fullWidth size="lg" icon={<LogOut size={18} />} onClick={handleLogout}>
            Log Out
          </Button>
        </motion.div>

        <div className="text-center pb-8">
          <p className="text-xs text-gray-400 dark:text-gray-500">ParkEase v1.0.0</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Smart Parking Finder · HCI Project</p>
        </div>
      </main>
    </div>
  );
}
