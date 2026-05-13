"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Star,
  ChevronRight,
  Car,
  AlertCircle,
} from "lucide-react";
import { mockBookings } from "@/data/mockData";
import { Booking, BookingStatus } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import toast from "react-hot-toast";

const STATUS_TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
];

const statusBadgeConfig: Record<
  string,
  {
    variant: "success" | "warning" | "error" | "info" | "neutral";
    label: string;
  }
> = {
  pending: { variant: "warning", label: "Pending" },
  confirmed: { variant: "success", label: "Confirmed" },
  active: { variant: "info", label: "Active" },
  completed: { variant: "neutral", label: "Completed" },
  cancelled: { variant: "error", label: "Cancelled" },
};

export default function BookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "upcoming")
      return ["pending", "confirmed", "active"].includes(b.status);
    if (activeTab === "past") return b.status === "completed";
    if (activeTab === "cancelled") return b.status === "cancelled";
    return true;
  });

  const handleCancel = (bookingId: string) => {
    if (
      confirm(
        "Are you sure you want to cancel this booking? Refund will be processed within 3-5 business days.",
      )
    ) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, status: "cancelled" as BookingStatus }
            : b,
        ),
      );
      toast.success("Booking cancelled successfully");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 glass-effect border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft
                size={20}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              My Bookings
            </h1>
          </div>

          <div className="flex gap-1 mt-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4">
        {filteredBookings.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              No bookings found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {activeTab === "upcoming"
                ? "You don't have any upcoming bookings"
                : activeTab === "past"
                  ? "You don't have any past bookings"
                  : "No cancelled bookings"}
            </p>
            <Button onClick={() => router.push("/")}>Find Parking</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking, index) => {
              const badge =
                statusBadgeConfig[booking.status] || statusBadgeConfig.pending;
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    hover
                    onClick={() => router.push(`/confirmation/${booking.id}`)}
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={booking.lot.photoUrls[0]}
                          alt={booking.lot.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {booking.lot.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin size={10} /> {booking.slot.label}
                            </p>
                          </div>
                          <Badge variant={badge.variant} size="sm">
                            {badge.label}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(booking.startTime).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {new Date(booking.startTime).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign size={11} />
                            SAR {booking.payment.totalAmount.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          {booking.status === "confirmed" && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancel(booking.id);
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                          {booking.status === "completed" &&
                            !booking.review && (
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<Star size={12} />}
                              >
                                Rate Lot
                              </Button>
                            )}
                          {booking.status === "completed" && (
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={<Car size={12} />}
                            >
                              Rebook
                            </Button>
                          )}
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-300 dark:text-gray-600 flex-shrink-0 self-center"
                      />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
