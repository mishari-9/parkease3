'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hover = false, padding = 'md' }) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const Component = hover ? motion.div : 'div';
  const hoverProps = hover ? {
    whileHover: { y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' },
    transition: { duration: 0.2 },
  } : {};

  return (
    <Component
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm ${paddings[padding]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...(hoverProps as any)}
    >
      {children}
    </Component>
  );
};
