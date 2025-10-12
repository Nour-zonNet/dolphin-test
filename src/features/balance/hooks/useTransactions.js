import { useState, useEffect, useCallback } from 'react';
import { SAMPLE_TRANSACTIONS } from '../utils/sampleData';

/**
 * Custom hook for managing transaction data
 * @returns {object} Transaction state and handlers
 */
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load transactions (simulated API call)
  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would be an API call
      setTransactions(SAMPLE_TRANSACTIONS);
    } catch (err) {
      setError('فشل في تحميل المعاملات. حاول مرة أخرى.');
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh transactions
  const refreshTransactions = useCallback(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Load transactions on mount
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    error,
    refreshTransactions,
  };
};
