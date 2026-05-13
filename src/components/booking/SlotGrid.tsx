'use client';
import React from 'react';
import { ParkingSlot } from '@/types';
import { motion } from 'framer-motion';

interface SlotGridProps {
  slots: ParkingSlot[];
  selectedSlotId: string | null;
  onSlotSelect: (slot: ParkingSlot) => void;
}

const statusColors = {
  available: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800/50',
  occupied: 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 border-red-200 dark:border-red-800 cursor-not-allowed opacity-60',
  reserved: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700 cursor-not-allowed opacity-70',
  maintenance: 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50',
};

const typeIcons: Record<string, string> = {
  standard: '🅿',
  compact: '🚗',
  disabled: '♿',
  ev: '⚡',
};

export const SlotGrid: React.FC<SlotGridProps> = ({ slots, selectedSlotId, onSlotSelect }) => {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
      {slots.map((slot, index) => (
        <motion.button
          key={slot.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.02, duration: 0.2 }}
          onClick={() => slot.status === 'available' && onSlotSelect(slot)}
          disabled={slot.status !== 'available'}
          className={`
            relative flex flex-col items-center justify-center p-2 rounded-lg border-2 text-xs font-medium transition-all duration-200
            ${statusColors[slot.status]}
            ${selectedSlotId === slot.id ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900 scale-110' : ''}
            ${slot.status === 'available' ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
          `}
        >
          <span className="text-base mb-0.5">{typeIcons[slot.type] || '🅿'}</span>
          <span className="font-semibold">{slot.label}</span>
          {slot.type === 'ev' && (
            <span className="absolute -top-1 -right-1 text-[10px]">⚡</span>
          )}
          {slot.type === 'disabled' && (
            <span className="absolute -top-1 -left-1 text-[10px]">♿</span>
          )}
        </motion.button>
      ))}
    </div>
  );
};
