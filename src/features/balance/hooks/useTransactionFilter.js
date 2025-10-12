import { useState, useMemo, useCallback } from 'react';
import { filterTransactionsByDate, sortTransactionsByDate, validateDateRange } from '../utils/transactionUtils';

/**
 * Custom hook for managing transaction filtering
 * @param {Array} transactions - Array of transactions to filter
 * @returns {object} Filter state and handlers
 */
export const useTransactionFilter = (transactions = []) => {
  const [dateFilter, setDateFilter] = useState({ 
    startDate: '', 
    endDate: '' 
  });
  const [error, setError] = useState('');

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    const filtered = filterTransactionsByDate(transactions, dateFilter.startDate, dateFilter.endDate);
    return sortTransactionsByDate(filtered);
  }, [transactions, dateFilter.startDate, dateFilter.endDate]);

  // Handle date filter changes
  const handleDateFilter = useCallback((startDate, endDate) => {
    // Validate date range
    const validation = validateDateRange(startDate, endDate);
    
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError('');
    setDateFilter({ startDate, endDate });
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setDateFilter({ startDate: '', endDate: '' });
    setError('');
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(dateFilter.startDate || dateFilter.endDate);
  }, [dateFilter.startDate, dateFilter.endDate]);

  return {
    dateFilter,
    filteredTransactions,
    error,
    handleDateFilter,
    clearFilters,
    hasActiveFilters,
  };
};
