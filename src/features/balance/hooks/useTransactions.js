import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWalletBalance } from '@/store/balanceSlice';
import { transformApiTransactions } from '../utils/transactionTransform';

/**
 * Custom hook for managing transaction data
 * @returns {object} Transaction state and handlers
 */
export const useTransactions = () => {
  const dispatch = useDispatch();
  const { transactions: rawTransactions, isLoading, error } = useSelector((state) => state.balance);
  const [localError, setLocalError] = useState('');

  // Transform raw transactions to component format
  const transactions = transformApiTransactions(rawTransactions);

  // Load transactions from API
  const loadTransactions = useCallback(async () => {
    try {
      setLocalError('');
      await dispatch(fetchWalletBalance()).unwrap();
    } catch (_err) {
      setLocalError('فشل في تحميل المعاملات. حاول مرة أخرى.');
      // Error loading transactions
    }
  }, [dispatch]);

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
    loading: isLoading,
    error: error || localError,
    refreshTransactions,
  };
};
