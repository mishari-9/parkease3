// ============================================================
// ParkEase — Mock Data (Qassim University Focus)
// ============================================================

import {
  ParkingLot,
  ParkingSlot,
  User,
  Vehicle,
  Booking,
  Review,
} from '@/types';

// ---- Qassim University Coordinates ----
// College of Computer: 26.3297° N, 43.9656° E

const generateSlots = (
  prefix: string,
  count: number,
  floor: number,
  availableCount: number
): ParkingSlot[] => {
  const statuses: ('available' | 'occupied' | 'reserved' | 'maintenance')[] = [
    'available',
    'occupied',
    'reserved',
    'maintenance',
  ];
  const types: ('standard' | 'compact' | 'disabled' | 'ev')[] = [
    'standard',
    'compact',
    'disabled',
    'ev',
  ];

  return Array.from({ length: count }, (_, i) => {
    const isAvailable = i < availableCount;
    const statusIdx = isAvailable
      ? 0
      : Math.random() > 0.8
        ? 2
        : Math.random() > 0.9
          ? 3
          : 1;

    return {
      id: `${prefix}-${i + 1}`,
      label: `${prefix}${i + 1}`,
      status: statuses[statusIdx] as ParkingSlot['status'],
      type: types[Math.floor(Math.random() * types.length)] as ParkingSlot['type'],
      floor,
    };
  });
};

export const mockParkingLots: ParkingLot[] = [
  {
    id: 'lot-1',
    name: 'College of Computer Parking A',
    nameAr: 'موقف كلية الحاسوب أ',
    address: 'Qassim University, College of Computer, Main Entrance',
    addressAr: 'جامعة القصيم، كلية الحاسوب، المدخل الرئيسي',
    location: { lat: 26.3297, lng: 43.9656 },
    totalSlots: 80,
    availableSlots: 34,
    pricePerHour: 5,
    pricePerDay: 30,
    rating: 4.5,
    reviewCount: 128,
    photoUrls: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800',
    ],
    amenities: {
      covered: true,
      evCharging: true,
      disabledAccess: true,
      cctv: true,
      valet: false,
      carWash: false,
    },
    hours: {
      is24Hours: false,
      openTime: '06:00',
      closeTime: '23:00',
      closedDays: [5], // Friday
    },
    slots: generateSlots('A', 80, 1, 34),
    distanceMeters: 50,
    description:
      'Main parking facility for the College of Computer. Covered parking with CCTV surveillance and EV charging stations.',
    descriptionAr:
      'موقف السيارات الرئيسي لكلية الحاسوب. موقف مغطي مع كاميرات مراقبة ومحطات شحن للسيارات الكهربائية.',
  },
  {
    id: 'lot-2',
    name: 'College of Computer Parking B',
    nameAr: 'موقف كلية الحاسوب ب',
    address: 'Qassim University, College of Computer, Side Entrance',
    addressAr: 'جامعة القصيم، كلية الحاسوب، المدخل الجانبي',
    location: { lat: 26.3289, lng: 43.9668 },
    totalSlots: 60,
    availableSlots: 22,
    pricePerHour: 3,
    pricePerDay: 20,
    rating: 4.2,
    reviewCount: 89,
    photoUrls: [
      'https://images.unsplash.com/photo-1573342212426-b30cbf9684c4?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
    ],
    amenities: {
      covered: false,
      evCharging: false,
      disabledAccess: true,
      cctv: true,
      valet: false,
      carWash: false,
    },
    hours: {
      is24Hours: false,
      openTime: '06:00',
      closeTime: '22:00',
      closedDays: [5],
    },
    slots: generateSlots('B', 60, 1, 22),
    distanceMeters: 120,
    description:
      'Open-air parking lot near the side entrance of the College of Computer. More affordable option.',
    descriptionAr:
      'موقف سيارات مفتوح بالقرب من المدخل الجانبي لكلية الحاسوب. خيار أكثر اقتصادا.',
  },
  {
    id: 'lot-3',
    name: 'Faculty & Staff Parking',
    nameAr: 'موقف أعضاء هيئة التدريس',
    address: 'Qassim University, College of Computer, Faculty Building',
    addressAr: 'جامعة القصيم، كلية الحاسوب، مبنى أعضاء هيئة التدريس',
    location: { lat: 26.3305, lng: 43.9648 },
    totalSlots: 40,
    availableSlots: 8,
    pricePerHour: 8,
    pricePerDay: 50,
    rating: 4.7,
    reviewCount: 56,
    photoUrls: [
      'https://images.unsplash.com/photo-1590674899484-d5640d8f0c1a?w=800',
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800',
    ],
    amenities: {
      covered: true,
      evCharging: true,
      disabledAccess: true,
      cctv: true,
      valet: true,
      carWash: true,
    },
    hours: {
      is24Hours: false,
      openTime: '07:00',
      closeTime: '21:00',
      closedDays: [5, 6],
    },
    slots: generateSlots('F', 40, 1, 8),
    distanceMeters: 200,
    description:
      'Premium parking for faculty and staff. Covered, valet service, and car wash available.',
    descriptionAr:
      'موقف سيارات متميز لأعضاء هيئة التدريس والموظفين. مغطي، مع خدمة صف السيارات وغسيل السيارات.',
  },
  {
    id: 'lot-4',
    name: 'Student Parking Zone 1',
    nameAr: 'منطقة مواقف الطلاب 1',
    address: 'Qassim University, Student Area, Zone 1',
    addressAr: 'جامعة القصيم، منطقة الطلاب، المنطقة 1',
    location: { lat: 26.3285, lng: 43.9642 },
    totalSlots: 120,
    availableSlots: 45,
    pricePerHour: 2,
    pricePerDay: 15,
    rating: 3.8,
    reviewCount: 210,
    photoUrls: [
      'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=800',
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
    ],
    amenities: {
      covered: false,
      evCharging: false,
      disabledAccess: true,
      cctv: false,
      valet: false,
      carWash: false,
    },
    hours: {
      is24Hours: false,
      openTime: '05:00',
      closeTime: '23:30',
      closedDays: [5],
    },
    slots: generateSlots('S1', 120, 1, 45),
    distanceMeters: 350,
    description:
      'Large student parking area. Budget-friendly option with ample space.',
    descriptionAr:
      'منطقة مواقف طلابية كبيرة. خيار اقتصادي مع مساحة واسعة.',
  },
  {
    id: 'lot-5',
    name: 'Student Parking Zone 2',
    nameAr: 'منطقة مواقف الطلاب 2',
    address: 'Qassim University, Student Area, Zone 2',
    addressAr: 'جامعة القصيم، منطقة الطلاب، المنطقة 2',
    location: { lat: 26.3278, lng: 43.9672 },
    totalSlots: 100,
    availableSlots: 52,
    pricePerHour: 2,
    pricePerDay: 15,
    rating: 3.6,
    reviewCount: 175,
    photoUrls: [
      'https://images.unsplash.com/photo-1573342212426-b30cbf9684c4?w=800',
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800',
    ],
    amenities: {
      covered: false,
      evCharging: false,
      disabledAccess: true,
      cctv: true,
      valet: false,
      carWash: false,
    },
    hours: {
      is24Hours: false,
      openTime: '05:00',
      closeTime: '23:30',
      closedDays: [5],
    },
    slots: generateSlots('S2', 100, 1, 52),
    distanceMeters: 400,
    description:
      'Second student parking zone with CCTV security. Budget-friendly.',
    descriptionAr:
      'منطقة مواقف طلابية ثانية مع كاميرات مراقبة. خيار اقتصادي.',
  },
  {
    id: 'lot-6',
    name: 'College of Computer VIP Parking',
    nameAr: 'موقف كبار الزوار - كلية الحاسوب',
    address: 'Qassim University, College of Computer, VIP Section',
    addressAr: 'جامعة القصيم، كلية الحاسوب، قسم كبار الزوار',
    location: { lat: 26.3301, lng: 43.9662 },
    totalSlots: 20,
    availableSlots: 6,
    pricePerHour: 15,
    pricePerDay: 100,
    rating: 4.9,
    reviewCount: 42,
    photoUrls: [
      'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800',
      'https://images.unsplash.com/photo-1590674899484-d5640d8f0c1a?w=800',
    ],
    amenities: {
      covered: true,
      evCharging: true,
      disabledAccess: true,
      cctv: true,
      valet: true,
      carWash: true,
    },
    hours: {
      is24Hours: false,
      openTime: '07:00',
      closeTime: '22:00',
      closedDays: [5],
    },
    slots: generateSlots('V', 20, 1, 6),
    distanceMeters: 80,
    description:
      'Premium VIP parking right next to the College of Computer entrance. All amenities included.',
    descriptionAr:
      'موقف سيارات VIP متميز بجوار مدخل كلية الحاسوب. جميع وسائل الراحة مشمولة.',
  },
  {
    id: 'lot-7',
    name: 'Library Parking',
    nameAr: 'موقف المكتبة',
    address: 'Qassim University, Central Library',
    addressAr: 'جامعة القصيم، المكتبة المركزية',
    location: { lat: 26.3312, lng: 43.964 },
    totalSlots: 50,
    availableSlots: 18,
    pricePerHour: 4,
    pricePerDay: 25,
    rating: 4.1,
    reviewCount: 67,
    photoUrls: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800',
    ],
    amenities: {
      covered: true,
      evCharging: false,
      disabledAccess: true,
      cctv: true,
      valet: false,
      carWash: false,
    },
    hours: {
      is24Hours: false,
      openTime: '07:00',
      closeTime: '22:00',
      closedDays: [5],
    },
    slots: generateSlots('L', 50, 1, 18),
    distanceMeters: 300,
    description:
      'Covered parking near the university library. Quiet and well-lit area.',
    descriptionAr:
      'موقف سيارات مغطي بالقرب من مكتبة الجامعة. منطقة هادئة وجيدة الإضاءة.',
  },
  {
    id: 'lot-8',
    name: 'Engineering College Overflow Parking',
    nameAr: 'موقف كلية الهندسة الإضافي',
    address: 'Qassim University, Engineering College Annex',
    addressAr: 'جامعة القصيم، ملحق كلية الهندسة',
    location: { lat: 26.328, lng: 43.9685 },
    totalSlots: 70,
    availableSlots: 38,
    pricePerHour: 3,
    pricePerDay: 18,
    rating: 3.9,
    reviewCount: 94,
    photoUrls: [
      'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=800',
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
    ],
    amenities: {
      covered: false,
      evCharging: false,
      disabledAccess: true,
      cctv: false,
      valet: false,
      carWash: false,
    },
    hours: {
      is24Hours: false,
      openTime: '06:00',
      closeTime: '23:00',
      closedDays: [5],
    },
    slots: generateSlots('E', 70, 1, 38),
    distanceMeters: 450,
    description:
      'Overflow parking for Engineering College. Walking distance to Computer College.',
    descriptionAr:
      'موقف سيارات إضافي لكلية الهندسة. على مسافة قريبة سيرا من كلية الحاسوب.',
  },
];

// ---- Mock User ----
export const mockUser: User = {
  id: 'user-1',
  fullName: 'Ahmed Al-Saud',
  email: 'ahmed@example.com',
  phone: '+966 55 123 4567',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
  language: 'en',
  vehicles: [
    {
      id: 'veh-1',
      plate: 'ABC 1234',
      make: 'Toyota',
      model: 'Camry',
      type: 'sedan',
      color: '#1E293B',
      isDefault: true,
    },
    {
      id: 'veh-2',
      plate: 'XYZ 5678',
      make: 'Tesla',
      model: 'Model 3',
      type: 'sedan',
      color: '#3B82F6',
      isDefault: false,
    },
  ],
  paymentMethods: [
    {
      id: 'pm-1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true,
    },
    {
      id: 'pm-2',
      type: 'stc_pay',
      last4: '',
      brand: 'STC Pay',
      isDefault: false,
    },
    {
      id: 'pm-3',
      type: 'mada',
      last4: '9876',
      brand: 'Mada',
      isDefault: false,
    },
  ],
  savedLotIds: ['lot-1', 'lot-3'],
  createdAt: new Date('2025-01-15'),
};

// ---- Mock Bookings ----
export const mockBookings: Booking[] = [
  {
    id: 'bkg-1',
    userId: 'user-1',
    lotId: 'lot-1',
    slotId: 'A15',
    vehicleId: 'veh-1',
    startTime: new Date(Date.now() + 3600000), // 1 hour from now
    endTime: new Date(Date.now() + 10800000),  // 3 hours from now
    status: 'confirmed',
    payment: {
      id: 'pi_1',
      baseAmount: 10,
      serviceFee: 0.5,
      totalAmount: 10.5,
      method: 'card',
      status: 'paid',
      paidAt: new Date(),
    },
    qrCodeData: 'eyJib29raW5nSWQiOiJia2ctMSIsInNsb3RJZCI6IkExNSIsInVzZXJJZCI6InVzZXItMSJ9',
    lot: mockParkingLots[0],
    slot: mockParkingLots[0].slots[14],
    review: null,
    createdAt: new Date(),
  },
  {
    id: 'bkg-2',
    userId: 'user-1',
    lotId: 'lot-2',
    slotId: 'B30',
    vehicleId: 'veh-1',
    startTime: new Date(Date.now() - 86400000),  // yesterday
    endTime: new Date(Date.now() - 72000000),    // 2 hours later
    status: 'completed',
    payment: {
      id: 'pi_2',
      baseAmount: 6,
      serviceFee: 0.3,
      totalAmount: 6.3,
      method: 'stc_pay',
      status: 'paid',
      paidAt: new Date(Date.now() - 86400000),
    },
    qrCodeData: 'eyJib29raW5nSWQiOiJia2ctMiIsInNsb3RJZCI6IkIzMCIsInVzZXJJZCI6InVzZXItMSJ9',
    lot: mockParkingLots[1],
    slot: mockParkingLots[1].slots[29],
    review: {
      id: 'rev-1',
      userId: 'user-1',
      lotId: 'lot-2',
      rating: 4,
      comment: 'Good parking spot, reasonable price. Could use more shade.',
      createdAt: new Date(Date.now() - 82800000),
      user: {
        fullName: 'Ahmed Al-Saud',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
      },
    },
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'bkg-3',
    userId: 'user-1',
    lotId: 'lot-1',
    slotId: 'A42',
    vehicleId: 'veh-2',
    startTime: new Date(Date.now() + 86400000 * 2),  // 2 days from now
    endTime: new Date(Date.now() + 86400000 * 2 + 14400000),  // 4 hours later
    status: 'pending',
    payment: {
      id: 'pi_3',
      baseAmount: 20,
      serviceFee: 1,
      totalAmount: 21,
      method: 'mada',
      status: 'paid',
      paidAt: new Date(),
    },
    qrCodeData: 'eyJib29raW5nSWQiOiJia2ctMyIsInNsb3RJZCI6IkE0MiIsInVzZXJJZCI6InVzZXItMSJ9',
    lot: mockParkingLots[0],
    slot: mockParkingLots[0].slots[41],
    review: null,
    createdAt: new Date(),
  },
];

// ---- Mock Reviews ----
export const mockReviews: Review[] = [
  {
    id: 'rev-1',
    userId: 'user-2',
    lotId: 'lot-1',
    rating: 5,
    comment: 'Excellent parking facility! Very clean and well-maintained.',
    createdAt: new Date(Date.now() - 172800000),
    user: {
      fullName: 'Sara Al-Otaibi',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
    },
  },
  {
    id: 'rev-2',
    userId: 'user-3',
    lotId: 'lot-1',
    rating: 4,
    comment: 'Good parking but can get full during exam periods.',
    createdAt: new Date(Date.now() - 259200000),
    user: {
      fullName: 'Mohammed Al-Qahtani',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed',
    },
  },
  {
    id: 'rev-3',
    userId: 'user-4',
    lotId: 'lot-3',
    rating: 5,
    comment: 'Best parking on campus. Valet service is amazing!',
    createdAt: new Date(Date.now() - 345600000),
    user: {
      fullName: 'Dr. Fahad Al-Harbi',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fahad',
    },
  },
  {
    id: 'rev-4',
    userId: 'user-5',
    lotId: 'lot-4',
    rating: 3,
    comment: 'Affordable but far from the computer college building.',
    createdAt: new Date(Date.now() - 432000000),
    user: {
      fullName: 'Nora Al-Anazi',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nora',
    },
  },
];

// ---- Helper: Calculate price ----
export const calculatePrice = (
  pricePerHour: number,
  hours: number
): { hours: number; baseAmount: number; serviceFee: number; totalAmount: number } => {
  const roundedHours = Math.ceil(hours * 2) / 2; // Ceil to nearest 30min
  const baseAmount = roundedHours * pricePerHour;
  const serviceFee = baseAmount * 0.05;
  const totalAmount = baseAmount + serviceFee;
  return { hours: roundedHours, baseAmount, serviceFee, totalAmount };
};

// ---- Helper: Haversine distance in meters ----
export const haversineDistance = (
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number => {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const aVal =
    sinDLat * sinDLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinDLng *
      sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return R * c;
};

// ---- Format distance ----
export const formatDistance = (meters: number): string => {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
};
