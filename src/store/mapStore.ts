import { create } from 'zustand';
import { MapState, MapRegion, SearchFilters, ParkingLot } from '@/types';
import { mockParkingLots } from '@/data/mockData';

export const useMapStore = create<MapState>((set) => ({
  lots: [],
  selectedLot: null,
  userLocation: { lat: 26.3297, lng: 43.9656 }, // Qassim University
  region: {
    latitude: 26.3297,
    longitude: 43.9656,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  },
  filters: {
    maxDistance: 5000,
    minPrice: 0,
    maxPrice: 100,
    covered: false,
    evCharging: false,
    disabledAccess: false,
    sortBy: 'distance',
  },
  isLoading: false,
  error: null,
  fetchLots: async (region: MapRegion, filters: SearchFilters) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      let filtered = [...mockParkingLots];
      if (filters.covered) filtered = filtered.filter((l) => l.amenities.covered);
      if (filters.evCharging) filtered = filtered.filter((l) => l.amenities.evCharging);
      if (filters.disabledAccess) filtered = filtered.filter((l) => l.amenities.disabledAccess);
      if (filters.minPrice > 0) filtered = filtered.filter((l) => l.pricePerHour >= filters.minPrice);
      if (filters.maxPrice < 100) filtered = filtered.filter((l) => l.pricePerHour <= filters.maxPrice);

      if (filters.sortBy === 'price') filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
      else if (filters.sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
      else filtered.sort((a, b) => a.distanceMeters - b.distanceMeters);

      set({ lots: filtered, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch parking lots', isLoading: false });
    }
  },
  selectLot: (lot: ParkingLot | null) => {
    set({ selectedLot: lot });
  },
  updateRegion: (region: MapRegion) => {
    set({ region });
  },
  applyFilters: (filters: SearchFilters) => {
    set({ filters });
  },
}));
