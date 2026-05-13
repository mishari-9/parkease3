// ============================================================
// ParkEase — All TypeScript Interfaces & Data Models
// ============================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  language: "ar" | "en";
  vehicles: Vehicle[];
  paymentMethods: PaymentMethod[];
  savedLotIds: string[];
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  type: "sedan" | "suv" | "truck" | "motorcycle";
  color: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "card" | "apple_pay" | "stc_pay" | "mada";
  last4: string;
  brand: string;
  isDefault: boolean;
}

export interface ParkingLot {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  location: Coordinates;
  totalSlots: number;
  availableSlots: number;
  pricePerHour: number;
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  photoUrls: string[];
  amenities: LotAmenities;
  hours: OpeningHours;
  slots: ParkingSlot[];
  distanceMeters: number;
  description: string;
  descriptionAr: string;
}

export interface LotAmenities {
  covered: boolean;
  evCharging: boolean;
  disabledAccess: boolean;
  cctv: boolean;
  valet: boolean;
  carWash: boolean;
}

export interface OpeningHours {
  is24Hours: boolean;
  openTime: string;
  closeTime: string;
  closedDays: number[];
}

export interface ParkingSlot {
  id: string;
  label: string;
  status: "available" | "occupied" | "reserved" | "maintenance";
  type: "standard" | "compact" | "disabled" | "ev";
  floor: number;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  userId: string;
  lotId: string;
  slotId: string;
  vehicleId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  payment: Payment;
  qrCodeData: string;
  lot: ParkingLot;
  slot: ParkingSlot;
  review: Review | null;
  createdAt: Date;
}

export interface Payment {
  id: string;
  baseAmount: number;
  serviceFee: number;
  totalAmount: number;
  method: "card" | "apple_pay" | "stc_pay" | "mada";
  status: "pending" | "paid" | "refunded" | "failed";
  paidAt: Date | null;
}

export interface Review {
  id: string;
  userId: string;
  lotId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    fullName: string;
    avatarUrl: string;
  };
}

export interface SearchFilters {
  maxDistance: number;
  minPrice: number;
  maxPrice: number;
  covered: boolean;
  evCharging: boolean;
  disabledAccess: boolean;
  sortBy: "distance" | "price" | "rating";
  startTime?: Date;
  endTime?: Date;
  query?: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface PriceBreakdown {
  hours: number;
  baseAmount: number;
  serviceFee: number;
  totalAmount: number;
}

export interface MapState {
  lots: ParkingLot[];
  selectedLot: ParkingLot | null;
  userLocation: Coordinates | null;
  region: MapRegion;
  filters: SearchFilters;
  isLoading: boolean;
  error: string | null;
  fetchLots: (region: MapRegion, filters: SearchFilters) => Promise<void>;
  selectLot: (lot: ParkingLot | null) => void;
  updateRegion: (region: MapRegion) => void;
  applyFilters: (filters: SearchFilters) => void;
}

export interface BookingState {
  lotId: string | null;
  slotId: string | null;
  startTime: Date | null;
  endTime: Date | null;
  vehicleId: string | null;
  paymentMethodId: string | null;
  step: number;
  confirmedBooking: Booking | null;
  isSubmitting: boolean;
  setLotId: (lotId: string) => void;
  setSlot: (slotId: string) => void;
  setTimeRange: (start: Date, end: Date) => void;
  setVehicle: (vehicleId: string) => void;
  setPaymentMethod: (id: string) => void;
  submitBooking: () => Promise<Booking>;
  reset: () => void;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: Partial<User> & { password: string }) => Promise<void>;
}

export interface UserState {
  savedLotIds: string[];
  toggleSavedLot: (lotId: string) => void;
  isSaved: (lotId: string) => boolean;
}
