'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ParkingLot } from '@/types';
import { calculateBookingPrice } from '@/utils/priceCalc';
import { formatPrice } from '@/utils/formatPrice';

interface PriceSummaryProps {
  lot: ParkingLot;
  startTime: Date | null;
  endTime: Date | null;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({ lot, startTime, endTime }) => {
  if (!startTime || !endTime || endTime <= startTime) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Select start and end time to see pricing</p>
      </div>
    );
  }

  const price = calculateBookingPrice(lot.pricePerHour, startTime, endTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 space-y-3"
    >
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Price Summary</h4>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {lot.name} × {price.hours}h
          </span>
          <span className="text-gray-900 dark:text-white font-medium">
            {formatPrice(price.baseAmount)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Service Fee (5%)</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {formatPrice(price.serviceFee)}
          </span>
        </div>

        <div className="border-t border-blue-200 dark:border-blue-800 pt-2" />

        <div className="flex justify-between">
          <span className="font-bold text-gray-900 dark:text-white">Total</span>
          <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
            {formatPrice(price.totalAmount)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
