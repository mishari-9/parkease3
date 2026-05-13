'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Apple } from 'lucide-react';
import { PaymentMethod } from '@/types';

interface PaymentSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const paymentIcons: Record<string, React.ReactNode> = {
  card: <CreditCard size={20} />,
  apple_pay: <Apple size={20} />,
  stc_pay: <Smartphone size={20} />,
  mada: <Building2 size={20} />,
};

const paymentLabels: Record<string, string> = {
  card: 'Credit / Debit Card',
  apple_pay: 'Apple Pay',
  stc_pay: 'STC Pay',
  mada: 'Mada',
};

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  paymentMethods,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Payment Method</h4>
      <div className="space-y-2">
        {paymentMethods.map((method, index) => (
          <motion.button
            key={method.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(method.id)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
              selectedId === method.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
            }`}
          >
            <span className={`p-2 rounded-lg ${selectedId === method.id ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-gray-100 dark:bg-gray-700'}`}>
              {paymentIcons[method.type]}
            </span>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {paymentLabels[method.type]}
              </p>
              {method.last4 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {method.brand} •••• {method.last4}
                </p>
              )}
            </div>
            {method.isDefault && (
              <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
            {selectedId === method.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
