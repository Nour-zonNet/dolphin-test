// Transaction types
export const TRANSACTION_TYPES = {
  SUBSCRIPTION: 'subscription',
  BALANCE_TOPUP: 'balance_topup',
  WALLET_PAYMENT: 'wallet_payment',
  RENEWAL: 'renewal',
  REFUND: 'refund',
};

// Transaction statuses
export const TRANSACTION_STATUS = {
  COMPLETED: 'completed',
  PENDING: 'pending',
  CANCELED: 'canceled',
};

// Payment methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'بطاقة ائتمان',
  BANK_TRANSFER: 'تحويل بنكي',
  WALLET: 'محفظة إلكترونية',
};

// File size limits
export const FILE_SIZE_LIMITS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD MMMM YYYY',
  API: 'YYYY-MM-DD',
};
