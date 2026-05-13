import { create } from "zustand";
import { BookingState, Booking } from "@/types";
import { mockParkingLots, mockUser } from "@/data/mockData";
import { calculatePrice } from "@/data/mockData";

export const useBookingStore = create<BookingState>((set, get) => ({
  lotId: null,
  slotId: null,
  startTime: null,
  endTime: null,
  vehicleId: null,
  paymentMethodId: null,
  step: 1,
  confirmedBooking: null,
  isSubmitting: false,
  setLotId: (lotId: string) => {
    set({ lotId });
  },
  setSlot: (slotId: string) => {
    set({ slotId });
  },
  setTimeRange: (start: Date, end: Date) => {
    set({ startTime: start, endTime: end });
  },
  setVehicle: (vehicleId: string) => {
    set({ vehicleId });
  },
  setPaymentMethod: (id: string) => {
    set({ paymentMethodId: id });
  },
  submitBooking: async (): Promise<Booking> => {
    set({ isSubmitting: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const state = get();
    const lot = mockParkingLots.find((l) => l.id === state.lotId)!;
    const slot = lot?.slots.find((s) => s.id === state.slotId)!;
    const hours =
      state.startTime && state.endTime
        ? (state.endTime.getTime() - state.startTime.getTime()) / 3600000
        : 1;
    const price = calculatePrice(lot?.pricePerHour || 5, hours);

    const booking: Booking = {
      id: `bkg-${Date.now()}`,
      userId: mockUser.id,
      lotId: state.lotId!,
      slotId: state.slotId!,
      vehicleId: state.vehicleId || mockUser.vehicles[0].id,
      startTime: state.startTime || new Date(),
      endTime: state.endTime || new Date(Date.now() + 3600000),
      status: "confirmed",
      payment: {
        id: `pi_${Date.now()}`,
        baseAmount: price.baseAmount,
        serviceFee: price.serviceFee,
        totalAmount: price.totalAmount,
        method: "card",
        status: "paid",
        paidAt: new Date(),
      },
      qrCodeData: btoa(
        JSON.stringify({
          bookingId: `bkg-${Date.now()}`,
          slotId: state.slotId,
          userId: mockUser.id,
          exp: Math.floor(
            (state.endTime?.getTime() || Date.now() + 3600000) / 1000,
          ),
        }),
      ),
      lot: lot!,
      slot: slot!,
      review: null,
      createdAt: new Date(),
    };

    set({ confirmedBooking: booking, isSubmitting: false });
    return booking;
  },
  reset: () => {
    set({
      lotId: null,
      slotId: null,
      startTime: null,
      endTime: null,
      vehicleId: null,
      paymentMethodId: null,
      step: 1,
      confirmedBooking: null,
      isSubmitting: false,
    });
  },
}));
