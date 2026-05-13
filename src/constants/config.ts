export const config = {
  appName: 'ParkEase',
  appNameAr: 'بارك إيز',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  map: {
    defaultCenter: { lat: 26.3297, lng: 43.9656 }, // Qassim University
    defaultZoom: 16,
    maxZoom: 19,
    minZoom: 10,
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  },
  booking: {
    maxDurationHours: 8,
    minDurationMinutes: 30,
    serviceFeePercent: 5,
    cancelBeforeHours: 1,
    reminderMinutes: 15,
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 50,
  },
  debounce: {
    search: 300,
    mapRegion: 500,
  },
};
