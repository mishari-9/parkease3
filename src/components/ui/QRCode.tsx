'use client';
import React from 'react';
import QRCodeSVG from 'react-qr-code';
import { Download, Share2 } from 'lucide-react';
import { Button } from './Button';
import { motion } from 'framer-motion';

interface QRCodeProps {
  value: string;
  bookingId: string;
  size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeProps> = ({ value, bookingId, size = 220 }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
    >
      <div className="p-4 bg-white rounded-xl">
        <QRCodeSVG value={value} size={size} level="H" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        Booking #{bookingId.slice(-6).toUpperCase()}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center max-w-xs">
        Show this QR code at the parking entrance for access
      </p>
      <div className="flex gap-3 mt-2">
        <Button variant="outline" size="sm" icon={<Download size={16} />}>
          Download
        </Button>
        <Button variant="outline" size="sm" icon={<Share2 size={16} />}>
          Share
        </Button>
      </div>
    </motion.div>
  );
};
