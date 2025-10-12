import { TRANSACTION_TYPES, TRANSACTION_STATUS, PAYMENT_METHODS } from './constants';

// Sample transaction data for development/testing
export const SAMPLE_TRANSACTIONS = [
  {
    id: "0018-2025 TXN",
    title: "باقة تأسيس اللغة الإنجليزية (المستوي الأول)",
    type: TRANSACTION_TYPES.SUBSCRIPTION,
    status: TRANSACTION_STATUS.COMPLETED,
    amount: 200,
    date: "16 ديسمبر 2025",
    paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
    timestamp: new Date('2025-12-16'),
  },
  {
    id: "0019-2025 TXN",
    title: "شحن الرصيد",
    type: TRANSACTION_TYPES.BALANCE_TOPUP,
    status: TRANSACTION_STATUS.PENDING,
    amount: 200,
    date: "16 ديسمبر 2025",
    paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
    timestamp: new Date('2025-12-16'),
  },
  {
    id: "0020-2025 TXN",
    title: "شحن الرصيد",
    type: TRANSACTION_TYPES.RENEWAL,
    status: TRANSACTION_STATUS.CANCELED,
    amount: 200,
    date: "16 ديسمبر 2025",
    paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
    timestamp: new Date('2025-12-16'),
  },
  {
    id: "0021-2025 TXN",
    title: "باقة تأسيس اللغة الإنجليزية (المستوي الأول)",
    type: TRANSACTION_TYPES.REFUND,
    status: TRANSACTION_STATUS.COMPLETED,
    amount: 200,
    date: "16 ديسمبر 2025",
    paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
    timestamp: new Date('2025-12-16'),
  }
];

// Transaction type labels
export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.SUBSCRIPTION]: 'اشتراك',
  [TRANSACTION_TYPES.BALANCE_TOPUP]: 'شحن رصيد',
  [TRANSACTION_TYPES.RENEWAL]: 'تجديد',
  [TRANSACTION_TYPES.REFUND]: 'استرداد',
};

// Status labels
export const STATUS_LABELS = {
  [TRANSACTION_STATUS.COMPLETED]: 'مكتمل',
  [TRANSACTION_STATUS.PENDING]: 'قيد الانتظار',
  [TRANSACTION_STATUS.CANCELED]: 'ملغي',
};
