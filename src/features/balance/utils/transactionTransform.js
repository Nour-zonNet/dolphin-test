/**
 * Transform API transaction data to match component expectations
 * @param {Array} apiTransactions - Raw transaction data from API
 * @returns {Array} Transformed transactions
 */
export const transformApiTransactions = (apiTransactions = []) => {
  return apiTransactions.map(transaction => ({
    id: transaction.reference_id?.toString() || transaction.id?.toString(),
    reference_id: transaction.reference_id,
    title: getTransactionTitle(transaction.type, transaction.amount),
    type: mapTransactionType(transaction.type),
    status: mapTransactionStatus(transaction.status),
    amount: Math.abs(transaction.amount), // Always positive for display
    date: formatTransactionDate(transaction.created_at),
    timestamp: new Date(transaction.created_at),
    paymentMethod: 'محفظة إلكترونية', // Default for wallet transactions
    description: transaction.description,
    originalData: transaction // Keep original data for reference
  }));
};

/**
 * Get transaction title based on type and amount
 * @param {string} type - Transaction type from API
 * @param {number} amount - Transaction amount
 * @returns {string} Transaction title
 */
const getTransactionTitle = (type, _amount) => {
  const typeLabels = {
    'deposit': 'شحن الرصيد',
    'withdrawal': 'سحب من الرصيد',
    'subscription': 'اشتراك',
    'refund': 'استرداد',
    'payment': 'دفع'
  };
  
  return typeLabels[type] || 'معاملة';
};

/**
 * Map API transaction type to component type
 * @param {string} apiType - Transaction type from API
 * @returns {string} Component transaction type
 */
const mapTransactionType = (apiType) => {
  const typeMapping = {
    'deposit': 'balance_topup',
    'withdrawal': 'refund',
    'subscription': 'subscription',
    'refund': 'refund',
    'payment': 'subscription'
  };
  
  return typeMapping[apiType] || 'balance_topup';
};

/**
 * Map API transaction status to component status
 * @param {string} apiStatus - Transaction status from API
 * @returns {string} Component transaction status
 */
const mapTransactionStatus = (apiStatus) => {
  const statusMapping = {
    'approved': 'completed',
    'pending': 'pending',
    'cancelled': 'canceled',
    'failed': 'canceled'
  };
  
  return statusMapping[apiStatus] || 'completed';
};

/**
 * Format transaction date for display
 * @param {string} dateString - ISO date string from API
 * @returns {string} Formatted date string
 */
const formatTransactionDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      calendar: 'gregory' // Use Gregorian calendar
    };
    
    return date.toLocaleDateString('ar-SA', options);
  } catch (_error) {
    // Error formatting date
    return 'تاريخ غير محدد';
  }
};

/**
 * Get Arabic status label
 * @param {string} status - Transaction status
 * @returns {string} Arabic status label
 */
export const getArabicStatusLabel = (status) => {
  const statusLabels = {
    'completed': 'مكتمل',
    'pending': 'قيد الانتظار',
    'canceled': 'ملغي'
  };
  
  return statusLabels[status] || 'غير محدد';
};
