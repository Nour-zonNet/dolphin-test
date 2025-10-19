import { TRANSACTION_STATUS } from './constants';

/**
 * Formats currency amount for display
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'SAR')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, _currency = 'SAR') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0.00 ر.س';
  }
  return `${amount.toFixed(2)} ر.س`;
};

/**
 * Gets the appropriate status color class
 * @param {string} status - Transaction status
 * @returns {string} Tailwind CSS class for status color
 */
export const getStatusColor = (status) => {
  const statusColors = {
    [TRANSACTION_STATUS.COMPLETED]: 'text-green-600 bg-green-100',
    [TRANSACTION_STATUS.PENDING]: 'text-yellow-600 bg-yellow-100',
    [TRANSACTION_STATUS.CANCELED]: 'text-red-600 bg-red-100',
  };
  
  return statusColors[status] || 'text-gray-600 bg-gray-100';
};

/**
 * Validates date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {object} Validation result with isValid and error message
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) {
    return { isValid: true };
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      return {
        isValid: false,
        error: 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية'
      };
    }
  }

  return { isValid: true };
};

/**
 * Filters transactions by date range
 * @param {Array} transactions - Array of transactions
 * @param {string} startDate - Start date filter
 * @param {string} endDate - End date filter
 * @returns {Array} Filtered transactions
 */
export const filterTransactionsByDate = (transactions, startDate, endDate) => {
  if (!startDate && !endDate) {
    return transactions;
  }

  return transactions.filter(transaction => {
    // Handle both timestamp and date fields
    const transactionDate = transaction.timestamp || new Date(transaction.date);
    
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Start of day
      if (transactionDate < start) return false;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      if (transactionDate > end) return false;
    }
    
    return true;
  });
};

/**
 * Sorts transactions by date (newest first)
 * @param {Array} transactions - Array of transactions
 * @returns {Array} Sorted transactions
 */
export const sortTransactionsByDate = (transactions) => {
  return [...transactions].sort((a, b) => {
    const dateA = a.timestamp || new Date(a.date);
    const dateB = b.timestamp || new Date(b.date);
    return dateB - dateA;
  });
};