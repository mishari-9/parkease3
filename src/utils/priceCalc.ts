import { PriceBreakdown } from '@/types';

export const calculateBookingPrice = (
  pricePerHour: number,
  startTime: Date,
  endTime: Date
): PriceBreakdown => {
  const diffMs = endTime.getTime() - startTime.getTime();
  const hours = Math.max(Math.ceil((diffMs / 3600000) * 2) / 2, 0.5); // ceil to 30min, min 30min
  const baseAmount = hours * pricePerHour;
  const serviceFee = baseAmount * 0.05;
  const totalAmount = baseAmount + serviceFee;
  return { hours, baseAmount, serviceFee, totalAmount };
};
