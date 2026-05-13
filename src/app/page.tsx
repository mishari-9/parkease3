"use client";
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ParkingMap } from "@/components/map/ParkingMap";
import { useMapStore } from "@/store/mapStore";
import { mockParkingLots } from "@/data/mockData";
import { ParkingLot } from "@/types";
import { config } from "@/constants/config";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDistance, haversineDistance } from "@/data/mockData";

const LotBottomSheet = dynamic(
  () =>
    import("@/components/map/LotBottomSheet").then((m) => ({
      default: m.LotBottomSheet,
    })),
  { ssr: false },
);

export default function HomePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileList, setShowMobileList] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredLots, setFilteredLots] = useState(mockParkingLots);

  const {
    lots,
    selectedLot,
    userLocation,
    fetchLots,
    selectLot,
    region,
    isLoading,
  } = useMapStore();

  useEffect(() => {
    setMounted(true);
    fetchLots(region, {
      maxDistance: 5000,
      minPrice: 0,
      maxPrice: 100,
      covered: false,
      evCharging: false,
      disabledAccess: false,
      sortBy: "distance",
    });
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    },
    [searchQuery, router],
  );

  const handleLotSelect = useCallback(
    (lot: ParkingLot) => {
      selectLot(lot);
    },
    [selectLot],
  );

  const handleViewDetails = useCallback(() => {
    if (selectedLot) {
      router.push(`/lot/${selectedLot.id}`);
    }
  }, [selectedLot, router]);

  const handleCloseSheet = useCallback(() => {
    selectLot(null);
  }, [selectLot]);

  const quickLots = mockParkingLots.slice(0, 4).map((lot) => ({
    ...lot,
    distanceMeters: userLocation
      ? Math.round(haversineDistance(userLocation, lot.location))
      : lot.distanceMeters,
  }));

  if (!mounted) {
    return <div className="h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-[1000] safe-top">
        <div className="px-4 pt-4 pb-2">
          <div className="glass-effect rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <MapPin size={16} className="text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold gradient-text">
                    ParkEase
                  </h1>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-0.5">
                    Qassim University
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {theme === "dark" ? (
                    <Sun size={18} className="text-yellow-400" />
                  ) : (
                    <Moon size={18} className="text-gray-600" />
                  )}
                </button>
                <button
                  onClick={() => router.push("/bookings")}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Menu
                    size={18}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-2.5 relative">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search parking spots..."
                  className="w-full pl-9 pr-12 py-2.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                    showFilters
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                  }`}
                >
                  <SlidersHorizontal size={15} />
                </button>
              </div>
            </form>

            {/* Filters (collapsible) */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 pt-3 pb-1">
                    <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors">
                      Available
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors">
                      Covered
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors">
                      EV Charging
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-800/50 transition-colors">
                      Disabled Access
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Map */}
      <main className="flex-1 relative">
        <ParkingMap
          onLotSelect={handleLotSelect}
          selectedLotId={selectedLot?.id || null}
          height="100%"
        />

        {/* Quick Access List (mobile toggle) */}
        <div className="absolute bottom-0 left-0 right-0 z-40">
          {/* Quick Lots Preview */}
          <div className="px-4 pb-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-effect rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Nearby Parking
                </h3>
                <button
                  onClick={() => setShowMobileList(!showMobileList)}
                  className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  {showMobileList
                    ? "Hide"
                    : `Show all (${mockParkingLots.length})`}
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {quickLots.map((lot) => (
                  <button
                    key={lot.id}
                    onClick={() => {
                      selectLot(lot);
                      handleLotSelect(lot);
                    }}
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        lot.availableSlots > 5
                          ? "bg-green-500"
                          : lot.availableSlots > 0
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <div className="text-left">
                      <p className="text-xs font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {lot.name}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        {lot.availableSlots} spots · SAR {lot.pricePerHour}/hr ·{" "}
                        {formatDistance(lot.distanceMeters)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Bottom Sheet */}
      <LotBottomSheet
        lot={selectedLot}
        onClose={handleCloseSheet}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}
