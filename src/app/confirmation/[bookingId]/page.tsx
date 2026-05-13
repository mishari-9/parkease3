'use client';
import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  MapPin,
  Navigation,
  Calendar,
  Clock,
  Car,
  DollarSign,
  Download,
  Share2,
  ArrowLeft,
  Home,
} from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { QRCodeDisplay } from '@/components/ui/QRCode';
import toast from 'react-hot-toast';

export default function ConfirmationPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { confirmedBooking } = useBookingStore();
  const booking = confirmedBooking;

  const handleNavigate = () => {
    if (booking?.lot?.location) {
      const { lat, lng } = booking.lot.location;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    } else {
      toast.error('Location not available');
    }
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={40} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Booking Found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This booking doesn't exist or has expired.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/bookings')}>My Bookings</Button>
          <Button onClick={() => router.push('/')}>Back to Map</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-gray-900">
      {/* Success Header */}
      <div className="pt-12 pb-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle2 size={44} className="text-green-500" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Booking Confirmed!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-500 dark:text-gray-400 mt-1"
        >
          Your parking spot has been reserved
        </motion.p>
      </div>

      <main className="max-w-md mx-auto px-4 pb-8 space-y-4">
        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <QRCodeDisplay value={booking.qrCodeData} bookingId={booking.id} />
        </motion.div>

        {/* Booking Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Booking Summary</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <img src={booking.lot.photoUrls[0]} alt={booking.lot.name} className="w-14 h-14 rounded-lg object-cover" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{booking.lot.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{booking.lot.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    <Calendar size={12} />
                    Date
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white text-xs">
                    {new Date(booking.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    <Clock size={12} />
                    Time
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white text-xs">
                    {new Date(booking.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    <MapPin size={12} />
                    Slot
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white text-xs">{booking.slot.label}</p>
                </div>
                <div className="p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    <DollarSign size={12} />
                    Total
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white text-xs">SAR {booking.payment.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Booking ID</span>
                <span className="text-xs font-mono font-medium text-gray-900 dark:text-white">
                  #{booking.id.slice(-8).toUpperCase()}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Button
            onClick={handleNavigate}
            fullWidth
            size="lg"
            icon={<Navigation size={18} />}
          >
            Navigate to Parking
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" fullWidth icon={<Download size={16} />}>
              Save Pass
            </Button>
            <Button variant="outline" fullWidth icon={<Share2 size={16} />}>
              Share
            </Button>
          </div>

          <Button
            variant="ghost"
            fullWidth
            icon={<Home size={16} />}
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
