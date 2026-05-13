'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Navigation, Clock, DollarSign, ChevronRight } from 'lucide-react';
import { ParkingLot } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface LotBottomSheetProps {
  lot: ParkingLot | null;
  onClose: () => void;
  onViewDetails: () => void;
}

export const LotBottomSheet: React.FC<LotBottomSheetProps> = ({ lot, onClose, onViewDetails }) => {
  if (!lot) return null;

  const availabilityRatio = lot.availableSlots / lot.totalSlots;
  const statusText = lot.availableSlots > 0
    ? `${lot.availableSlots} spots available`
    : 'Full';
  const statusVariant = lot.availableSlots > 0 ? 'success' : 'error';
  const distanceText = lot.distanceMeters < 1000
    ? `${lot.distanceMeters}m`
    : `${(lot.distanceMeters / 1000).toFixed(1)}km`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        />

        {/* Sheet */}
        <div className="relative bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>

          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>

          <div className="px-5 pb-6">
            {/* Image */}
            <div className="relative h-40 -mx-5 -mt-2 mb-4 overflow-hidden">
              <img
                src={lot.photoUrls[0]}
                alt={lot.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Badge variant={lot.availableSlots > 5 ? 'success' : lot.availableSlots > 0 ? 'warning' : 'error'} size="sm" className="absolute top-3 left-3">
                {lot.availableSlots > 0 ? `${lot.availableSlots} Available` : 'Full'}
              </Badge>
            </div>

            {/* Name & Rating */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{lot.name}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                  <MapPin size={12} />
                  {lot.address}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">{lot.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <DollarSign size={14} />
                <span>SAR {lot.pricePerHour}/hr</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Navigation size={14} />
                <span>{distanceText}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Clock size={14} />
                <span>{lot.hours.openTime} - {lot.hours.closeTime}</span>
              </div>
            </div>

            {/* View Details Button */}
            <Button
              onClick={onViewDetails}
              fullWidth
              icon={<ChevronRight size={16} />}
              size="lg"
            >
              View Details & Reserve
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
