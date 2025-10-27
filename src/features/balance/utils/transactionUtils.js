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
    [TRANSACTION_STATUS.COMPLETED]: 'text-[#2E7D32]',
    [TRANSACTION_STATUS.PENDING]: 'text-orangedeep',
    [TRANSACTION_STATUS.CANCELED]: 'text-[#E21B1B]',
  };
  
  return statusColors[status] || 'text-gray-600';
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
 * Filters transactions by status
 * @param {Array} transactions - Array of transactions
 * @param {string} status - Status filter ('الكل', 'completed', 'canceled', 'pending')
 * @returns {Array} Filtered transactions
 */
export const filterTransactionsByStatus = (transactions, status) => {
  if (!status || status === 'الكل') {
    return transactions;
  }

  return transactions.filter(transaction => {
    return transaction.status === status;
  });
};

/**
 * Filters transactions by search query
 * @param {Array} transactions - Array of transactions
 * @param {string} query - Search query
 * @returns {Array} Filtered transactions
 */
export const filterTransactionsBySearch = (transactions, query) => {
  if (!query || query.trim() === '') {
    return transactions;
  }

  const searchTerm = query.toLowerCase().trim();
  
  return transactions.filter(transaction => {
    // Search in transaction ID
    const transactionId = (transaction.reference_id || transaction.id || '').toString().toLowerCase();
    if (transactionId.includes(searchTerm)) {
      return true;
    }

    // Search in transaction type/operation
    const operationType = (transaction.type || '').toLowerCase();
    if (operationType.includes(searchTerm)) {
      return true;
    }

    // Search in amount
    const amount = (transaction.amount || 0).toString();
    if (amount.includes(searchTerm)) {
      return true;
    }

    // Search in status
    const status = (transaction.status || '').toLowerCase();
    if (status.includes(searchTerm)) {
      return true;
    }

    return false;
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