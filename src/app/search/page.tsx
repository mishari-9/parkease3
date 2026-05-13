'use client';
import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Star, Navigation, Clock, DollarSign, Filter } from 'lucide-react';
import { mockParkingLots, formatDistance, haversineDistance } from '@/data/mockData';
import { ParkingLot } from '@/types';
import { useMapStore } from '@/store/mapStore';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<ParkingLot[]>([]);
  const [searchText, setSearchText] = useState(query);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');
  const { userLocation } = useMapStore();
  const { isSaved, toggleSavedLot } = useUserStore();

  useEffect(() => {
    setIsLoading(true);
    // Simulate search delay
    const timer = setTimeout(() => {
      let filtered = [...mockParkingLots];

      // Filter by query
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (lot) =>
            lot.name.toLowerCase().includes(q) ||
            lot.nameAr.includes(q) ||
            lot.address.toLowerCase().includes(q) ||
            lot.description.toLowerCase().includes(q)
        );
      }

      // Calculate distances
      filtered = filtered.map((lot) => ({
        ...lot,
        distanceMeters: userLocation
          ? Math.round(haversineDistance(userLocation, lot.location))
          : lot.distanceMeters,
      }));

      // Sort
      if (sortBy === 'price') filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
      else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
      else filtered.sort((a, b) => a.distanceMeters - b.distanceMeters);

      setResults(filtered);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, sortBy, userLocation]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchText.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchText)}`);
      }
    },
    [searchText, router]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search parking spots..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  autoFocus
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Sort Options */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? 'Searching...' : `${results.length} parking spots found`}
          </p>
          <div className="flex gap-1">
            {(['distance', 'price', 'rating'] as const).map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                  sortBy === sort
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {sort === 'distance' ? 'Nearest' : sort === 'price' ? 'Cheapest' : 'Top Rated'}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" text="Searching for parking..." />
          </div>
        ) : results.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No parking found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search or filters
            </p>
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to Map
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((lot, index) => (
              <motion.div
                key={lot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover onClick={() => router.push(`/lot/${lot.id}`)}>
                  <div className="flex gap-3">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={lot.photoUrls[0]} alt={lot.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 left-1">
                        <Badge
                          variant={lot.availableSlots > 5 ? 'success' : lot.availableSlots > 0 ? 'warning' : 'error'}
                          size="sm"
                        >
                          {lot.availableSlots}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {lot.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {lot.address}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSavedLot(lot.id);
                          }}
                          className={`p-1 rounded-lg transition-colors ${
                            isSaved(lot.id) ? 'text-blue-600' : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'
                          }`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved(lot.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-500 fill-yellow-500" />
                          {lot.rating.toFixed(1)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Navigation size={12} />
                          {formatDistance(lot.distanceMeters)}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={12} />
                          SAR {lot.pricePerHour}/hr
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {lot.amenities.covered && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Covered</span>}
                        {lot.amenities.evCharging && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">EV</span>}
                        {lot.amenities.cctv && <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">CCTV</span>}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" text="Loading..." />}>
      <SearchContent />
    </Suspense>
  );
}
