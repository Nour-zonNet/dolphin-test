import { useState, useMemo, useCallback } from 'react';
import { 
  filterTransactionsByDate, 
  filterTransactionsByStatus, 
  filterTransactionsBySearch,
  sortTransactionsByDate, 
  validateDateRange 
} from '../utils/transactionUtils';

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
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    
    // Apply date filter
    filtered = filterTransactionsByDate(filtered, dateFilter.startDate, dateFilter.endDate);
    
    // Apply status filter
    filtered = filterTransactionsByStatus(filtered, statusFilter);
    
    // Apply search filter
    filtered = filterTransactionsBySearch(filtered, searchQuery);
    
    // Sort by date
    return sortTransactionsByDate(filtered);
  }, [transactions, dateFilter.startDate, dateFilter.endDate, statusFilter, searchQuery]);

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

  // Handle status filter changes
  const handleStatusFilter = useCallback((status) => {
    setStatusFilter(status);
  }, []);

  // Handle search query changes
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setDateFilter({ startDate: '', endDate: '' });
    setStatusFilter('الكل');
    setSearchQuery('');
    setError('');
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(dateFilter.startDate || dateFilter.endDate || statusFilter !== 'الكل' || searchQuery.trim() !== '');
  }, [dateFilter.startDate, dateFilter.endDate, statusFilter, searchQuery]);

  return {
    dateFilter,
    statusFilter,
    searchQuery,
    filteredTransactions,
    error,
    handleDateFilter,
    handleStatusFilter,
    handleSearch,
    clearFilters,
    hasActiveFilters,
  };
};
