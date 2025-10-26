/**
 * Transform API transaction data to match component expectations
 * @param {Array} apiTransactions - Raw transaction data from API
 * @returns {Array} Transformed transactions
 */
export const transformApiTransactions = (apiTransactions = []) => {
  return apiTransactions.map(transaction => {
    // Get the transaction type from various possible fields
    const apiType = transaction.type || transaction.transaction_type || transaction.type_name;
    const mappedType = mapTransactionType(apiType, transaction);
    return {
      id: transaction.reference_id?.toString() || transaction.id?.toString(),
      reference_id: transaction.reference_id,
      title: getTransactionTitle(transaction, mappedType),
      type: mappedType,
      status: mapTransactionStatus(transaction.status),
      amount: Math.abs(transaction.amount), // Always positive for display
      date: formatTransactionDate(transaction.created_at),
      timestamp: transaction.created_at, // Keep as string to avoid Redux serialization issues
      paymentMethod: 'محفظة إلكترونية', // Default for wallet transactions
      description: transaction.description,
      originalData: transaction // Keep original data for reference
    };
  });
};

/**
 * Get transaction title based on transaction data and mapped type
 * @param {object} transaction - Full transaction object from API
 * @param {string} mappedType - The mapped transaction type
 * @returns {string} Transaction title
 */
const getTransactionTitle = (transaction, mappedType) => {
  // For balance recharge (balance_topup), always show "شحن رصيد"
  if (mappedType === 'balance_topup') {
    return 'شحن رصيد';
  }
  
  // For subscriptions/renewals, show the package name if available
  if (mappedType === 'subscription' || mappedType === 'renewal') {
    if (transaction?.package_name || transaction?.package_title || transaction?.title) {
      return transaction.package_name || transaction.package_title || transaction.title;
    }
    // Fallback to generic label
    return mappedType === 'renewal' ? 'تجديد باقة' : 'اشتراك في باقة';
  }
  
  // Otherwise, use type-based generic labels
  const typeLabels = {
    'balance_topup': 'شحن رصيد',
    'subscription': 'اشتراك في باقة',
    'renewal': 'تجديد باقة',
    'refund': 'استرداد',
    'wallet_payment': 'دفع من المحفظة'
  };
  
  return typeLabels[mappedType] || 'معاملة';
};

/**
 * Map API transaction type to component type
 * @param {string} apiType - Transaction type from API
 * @param {object} transaction - Full transaction object for context
 * @returns {string} Component transaction type
 */
const mapTransactionType = (apiType, transaction = {}) => {
  // Normalize the API type (it might be camelCase, snake_case, or other formats)
  const normalizedType = apiType ? String(apiType).toLowerCase() : '';
  
  const typeMapping = {
    'deposit': 'balance_topup',
    'balance_topup': 'balance_topup',
    'recharge': 'balance_topup',
    'wallet_recharge': 'balance_topup',
    'withdrawal': 'refund',
    'subscription': 'subscription',
    'package_subscription': 'subscription',
    'subscription_payment': 'subscription',
    'renewal': 'renewal',
    'package_renewal': 'renewal',
    'refund': 'refund',
    'payment': 'subscription',
    'purchase': 'subscription',
    'package_payment': 'subscription'
  };
  
  // Check if there's an explicit mapping
  if (typeMapping[normalizedType]) {
    return typeMapping[normalizedType];
  }
  
  // If transaction has package information, it's likely a subscription or renewal
  if (transaction?.package_name || transaction?.package_title || transaction?.package_id) {
    // Check if it's a renewal based on keywords in title or description
    const title = (transaction?.title || '').toLowerCase();
    const description = (transaction?.description || '').toLowerCase();
    
    if (title.includes('تجديد') || title.includes('renew') || 
        description.includes('تجديد') || description.includes('renew')) {
      return 'renewal';
    }
    
    return 'subscription';
  }
  
  // Default to balance_topup for unknown types
  return 'balance_topup';
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
    'completed': 'مكتملة',
    'pending': 'معلقة',
    'canceled': 'ملغية'
  };
  
  return statusLabels[status] || 'غير محدد';
};
