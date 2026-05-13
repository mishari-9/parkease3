'use client';
import React from 'react';

// LotPin logic is now integrated into ParkingMap.tsx via custom markers
// This export is maintained for API compatibility

export interface LotPinProps {
  availableSlots: number;
  totalSlots: number;
  isSelected?: boolean;
  label?: string;
}

export const getPinColor = (availableSlots: number, totalSlots: number): string => {
  const ratio = availableSlots / totalSlots;
  if (ratio > 0.3) return '#2ECC71';
  if (ratio > 0) return '#F39C12';
  return '#EF4444';
};

export const LotPin: React.FC<LotPinProps> = ({ availableSlots, totalSlots, isSelected, label }) => {
  const color = getPinColor(availableSlots, totalSlots);
  const size = isSelected ? 48 : 36;
  const displayLabel = label || (availableSlots > 0 ? `${availableSlots}` : 'F');

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: isSelected ? 14 : 11,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        border: isSelected ? '3px solid white' : '2px solid white',
        transition: 'all 0.3s ease',
      }}
    >
      {displayLabel}
    </div>
  );
};
