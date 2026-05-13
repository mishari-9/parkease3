"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ChevronLeft,
  Clock,
  Car,
  CreditCard,
  FileText,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { useAuthStore } from "@/store/authStore";
import { mockParkingLots, mockUser } from "@/data/mockData";
import { ParkingLot } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DateTimePicker } from "@/components/booking/DateTimePicker";
import { PriceSummary } from "@/components/booking/PriceSummary";
import { PaymentSelector } from "@/components/booking/PaymentSelector";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import toast from "react-hot-toast";

const STEPS = [
  { number: 1, label: "Time", icon: Clock },
  { number: 2, label: "Vehicle", icon: Car },
  { number: 3, label: "Review", icon: FileText },
  { number: 4, label: "Payment", icon: CreditCard },
];

export default function BookingFlowPage({
  params,
}: {
  params: Promise<{ lotId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [lot, setLot] = useState<ParkingLot | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    step,
    startTime,
    endTime,
    vehicleId,
    paymentMethodId,
    isSubmitting,
    confirmedBooking,
    setTimeRange,
    setVehicle,
    setPaymentMethod,
    submitBooking,
    reset,
  } = useBookingStore();
  const { user } = useAuthStore();

  const currentUser = user || mockUser;

  useEffect(() => {
    const found = mockParkingLots.find((l) => l.id === resolvedParams.lotId);
    if (found) {
      setLot(found);
      useBookingStore.setState({ lotId: found.id });
    }
    setLoading(false);
    return () => {
      // Cleanup on unmount
    };
  }, [resolvedParams.lotId]);

  const handleNext = () => {
    if (step < 4) {
      useBookingStore.setState({ step: step + 1 });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      useBookingStore.setState({ step: step - 1 });
    } else {
      router.back();
    }
  };

  const handleSubmitBooking = async () => {
    if (!startTime || !endTime || !vehicleId || !paymentMethodId) {
      toast.error("Please complete all steps");
      return;
    }
    try {
      const booking = await submitBooking();
      toast.success("Booking confirmed!");
      router.push(`/confirmation/${booking.id}`);
    } catch (err) {
      toast.error("Booking failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
        <h2 className="text-xl font-bold mb-4">Parking lot not found</h2>
        <Button onClick={() => router.push("/")}>Back to Map</Button>
      </div>
    );
  }

  const canProceed =
    (step === 1 && startTime && endTime && endTime > startTime) ||
    (step === 2 && vehicleId) ||
    (step === 3 && true) ||
    (step === 4 && paymentMethodId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft
                size={20}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>
            <div className="flex-1">
              <h1 className="text-base font-bold text-gray-900 dark:text-white">
                Reserve Parking
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {lot?.name}
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-1 mt-3">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.number}>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step > s.number
                        ? "bg-green-500 text-white"
                        : step === s.number
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step > s.number ? <Check size={12} /> : s.number}
                  </div>
                  <span
                    className={`text-[10px] font-medium hidden sm:block ${step >= s.number ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 rounded-full mx-1 ${
                      step > s.number
                        ? "bg-green-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Time Selection */}
            {step === 1 && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} className="text-blue-600" />
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    Select Date & Time
                  </h2>
                </div>
                <DateTimePicker
                  startTime={startTime}
                  endTime={endTime}
                  onStartChange={(d) =>
                    setTimeRange(d, endTime || new Date(d.getTime() + 3600000))
                  }
                  onEndChange={(d) => setTimeRange(startTime || new Date(), d)}
                />
              </Card>
            )}

            {/* Step 2: Vehicle Selection */}
            {step === 2 && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Car size={18} className="text-blue-600" />
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    Select Vehicle
                  </h2>
                </div>
                <div className="space-y-2">
                  {currentUser.vehicles.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVehicle(v.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                        vehicleId === v.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <Car
                          size={18}
                          className="text-gray-600 dark:text-gray-300"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {v.make} {v.model}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {v.plate} · {v.color} · {v.type}
                        </p>
                      </div>
                      {v.isDefault && (
                        <Badge variant="info" size="sm">
                          Default
                        </Badge>
                      )}
                      {vehicleId === v.id && (
                        <CheckCircle2 size={20} className="text-blue-600" />
                      )}
                    </button>
                  ))}
                  <button className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600">
                    <Plus size={16} />
                    Add New Vehicle
                  </button>
                </div>
              </Card>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-4">
                <Card>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={18} className="text-blue-600" />
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                      Review Booking
                    </h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <img
                        src={lot.photoUrls[0]}
                        alt={lot.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {lot.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {lot.address}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          SAR {lot.pricePerHour}/hr · {lot.availableSlots} spots
                          available
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Date
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {startTime?.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Time
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {startTime?.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {endTime?.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Vehicle
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {
                            currentUser.vehicles.find((v) => v.id === vehicleId)
                              ?.make
                          }{" "}
                          {
                            currentUser.vehicles.find((v) => v.id === vehicleId)
                              ?.model
                          }
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Duration
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {startTime && endTime
                            ? `${Math.round(((endTime.getTime() - startTime.getTime()) / 3600000) * 10) / 10}h`
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <PriceSummary
                  lot={lot}
                  startTime={startTime}
                  endTime={endTime}
                />
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <div className="space-y-4">
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard size={18} className="text-blue-600" />
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                      Payment Method
                    </h2>
                  </div>
                  <PaymentSelector
                    paymentMethods={currentUser.paymentMethods}
                    selectedId={paymentMethodId}
                    onSelect={setPaymentMethod}
                  />
                </Card>

                <PriceSummary
                  lot={lot}
                  startTime={startTime}
                  endTime={endTime}
                />

                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      By confirming, you agree to ParkEase's terms of service
                      and cancellation policy. You can cancel up to 1 hour
                      before the booking starts for a full refund.
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 glass-effect border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex-shrink-0"
          >
            <ChevronLeft size={16} />
            Back
          </Button>

          {step < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              fullWidth
              icon={<ChevronRight size={16} />}
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmitBooking}
              disabled={!canProceed || isSubmitting}
              loading={isSubmitting}
              fullWidth
              size="lg"
            >
              {isSubmitting ? "Processing Payment..." : `Pay & Confirm`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
