'use client';
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Navigation,
  Shield,
  Car,
  Zap,
  Umbrella,
  WashingMachine,
  Heart,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  BarChart3,
} from 'lucide-react';
import { mockParkingLots, mockReviews, formatDistance } from '@/data/mockData';
import { ParkingLot, ParkingSlot } from '@/types';
import { useBookingStore } from '@/store/bookingStore';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { StarRating } from '@/components/ui/StarRating';
import { SlotGrid } from '@/components/booking/SlotGrid';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function LotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [lot, setLot] = useState<ParkingLot | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'slots' | 'info' | 'reviews'>('slots');
  const { setSlot, setLotId } = useBookingStore();
  const { isSaved, toggleSavedLot } = useUserStore();

  useEffect(() => {
    setLoading(true);
    const found = mockParkingLots.find((l) => l.id === resolvedParams.id);
    if (found) {
      setLot(found);
      setLotId(found.id);
    }
    setLoading(false);
  }, [resolvedParams.id, setLotId]);

  const handleSlotSelect = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setSlot(slot.id);
  };

  const handleReserve = () => {
    if (selectedSlot && lot) {
      router.push(`/booking/${lot.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading parking details..." />
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <XCircle size={32} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Parking Not Found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This parking lot doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/')}>Back to Map</Button>
      </div>
    );
  }

  const reviews = mockReviews.filter((r) => r.lotId === lot.id);
  const floorSlots = selectedSlot ? lot.slots.filter((s) => s.floor === selectedSlot.floor) : lot.slots;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="relative">
        {/* Image Carousel */}
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <motion.img
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={lot.photoUrls[currentImage]}
            alt={lot.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Navigation Buttons */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 p-2 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-lg backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-colors z-10"
          >
            <ArrowLeft size={20} className="text-gray-800 dark:text-white" />
          </button>

          <button
            onClick={() => toggleSavedLot(lot.id)}
            className={`absolute top-4 right-4 p-2 rounded-xl shadow-lg backdrop-blur-sm transition-colors z-10 ${
              isSaved(lot.id)
                ? 'bg-red-50 dark:bg-red-900/40 text-red-500'
                : 'bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900'
            }`}
          >
            <Heart size={20} fill={isSaved(lot.id) ? 'currentColor' : 'none'} />
          </button>

          {/* Image Navigation Arrows */}
          {lot.photoUrls.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : lot.photoUrls.length - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg backdrop-blur-sm"
              >
                <ChevronLeft size={18} className="text-gray-800 dark:text-white" />
              </button>
              <button
                onClick={() => setCurrentImage((prev) => (prev < lot.photoUrls.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 dark:bg-gray-900/80 rounded-full shadow-lg backdrop-blur-sm"
              >
                <ChevronRight size={18} className="text-gray-800 dark:text-white" />
              </button>
            </>
          )}

          {/* Image Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {lot.photoUrls.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentImage ? 'bg-white w-5' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Title & Quick Info */}
        <div className="px-4 py-4 -mt-4 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{lot.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                  <MapPin size={14} />
                  {lot.address}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1.5 rounded-lg flex-shrink-0 ml-2">
                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">{lot.rating.toFixed(1)}</span>
                <span className="text-xs text-yellow-500">({lot.reviewCount})</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <DollarSign size={15} className="text-blue-500" />
                <span className="font-medium text-gray-900 dark:text-white">SAR {lot.pricePerHour}</span>
                <span>/hr</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Navigation size={15} className="text-green-500" />
                <span>{formatDistance(lot.distanceMeters)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Clock size={15} className="text-purple-500" />
                <span>{lot.hours.openTime} - {lot.hours.closeTime}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <BarChart3 size={15} className="text-orange-500" />
                <span className={`font-medium ${lot.availableSlots > 10 ? 'text-green-600 dark:text-green-400' : lot.availableSlots > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                  {lot.availableSlots}/{lot.totalSlots}
                </span>
                <span>available</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pb-24">
        {/* Amenities */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {lot.amenities.covered && <Badge variant="info" size="md" className="flex items-center gap-1"><Umbrella size={12} /> Covered</Badge>}
            {lot.amenities.evCharging && <Badge variant="info" size="md" className="flex items-center gap-1"><Zap size={12} /> EV Charging</Badge>}
            {lot.amenities.disabledAccess && <Badge variant="info" size="md" className="flex items-center gap-1"><span>♿</span> Disabled Access</Badge>}
            {lot.amenities.cctv && <Badge variant="info" size="md" className="flex items-center gap-1"><Shield size={12} /> CCTV</Badge>}
            {lot.amenities.valet && <Badge variant="info" size="md" className="flex items-center gap-1"><Car size={12} /> Valet</Badge>}
            {lot.amenities.carWash && <Badge variant="info" size="md" className="flex items-center gap-1"><WashingMachine size={12} /> Car Wash</Badge>}
          </div>
        </div>

        {/* Description */}
        <Card className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{lot.description}</p>
        </Card>

        {/* Tabs: Slots | Info | Reviews */}
        <div className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {([
            { key: 'slots', label: 'Parking Slots' },
            { key: 'info', label: 'Hours & Info' },
            { key: 'reviews', label: `Reviews (${reviews.length})` },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {activeTab === 'slots' && (
            <Card padding="none" className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Select a Slot
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm">Available</Badge>
                    <Badge variant="error" size="sm">Occupied</Badge>
                    <Badge variant="warning" size="sm">Reserved</Badge>
                  </div>
                </div>
                <SlotGrid
                  slots={floorSlots}
                  selectedSlotId={selectedSlot?.id || null}
                  onSlotSelect={handleSlotSelect}
                />
              </div>
            </Card>
          )}

          {activeTab === 'info' && (
            <Card>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Open 24 Hours</span>
                  <span className={`text-sm font-medium ${lot.hours.is24Hours ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                    {lot.hours.is24Hours ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Opening Time</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{lot.hours.openTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Closing Time</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{lot.hours.closeTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Closed Days</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {lot.hours.closedDays.length === 0 ? 'None' : lot.hours.closedDays.map((d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}
                  </span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Slots</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{lot.totalSlots}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Price Per Day</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">SAR {lot.pricePerDay}</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <Card className="text-center py-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No reviews yet</p>
                </Card>
              ) : (
                reviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card>
                      <div className="flex items-start gap-3">
                        <img
                          src={review.user.avatarUrl}
                          alt={review.user.fullName}
                          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{review.user.fullName}</h4>
                            <StarRating rating={review.rating} size={12} showValue={false} />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{review.comment}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 glass-effect border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedSlot ? `Slot ${selectedSlot.label} selected` : 'Select a parking slot'}
            </p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              SAR {lot.pricePerHour} <span className="text-sm font-normal text-gray-500">/hr</span>
            </p>
          </div>
          <Button
            onClick={handleReserve}
            disabled={!selectedSlot}
            size="lg"
            icon={<CheckCircle size={18} />}
          >
            Reserve Now
          </Button>
        </div>
      </div>
    </div>
  );
}
