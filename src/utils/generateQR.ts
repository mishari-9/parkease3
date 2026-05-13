interface BookingQR {
  bookingId: string;
  slotId: string;
  userId: string;
  exp: number;
}

export const generateQRPayload = (
  bookingId: string,
  slotId: string,
  userId: string,
  endTime: Date
): string => {
  const payload: BookingQR = {
    bookingId,
    slotId,
    userId,
    exp: Math.floor(endTime.getTime() / 1000),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const parseQRPayload = (payload: string): BookingQR | null => {
  try {
    const decoded = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};
