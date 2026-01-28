import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api.js";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // fetches helper with safe fail
  const safeFetchJson = useCallback(async (url, actionName = "Fetch") => {
    if (!userId) return null;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const text = await response.text();
        console.error(`${actionName} failed:`, text);
        Alert.alert("Error", `${actionName} failed. Returning empty data.`);
        return null; // allow app to continue
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`${actionName} exception:`, error);
      Alert.alert("Error", `${actionName} failed. Returning empty data.`);
      return null; // allow app to continue
    }
  }, [userId]);

  // transactions
  const fetchTransactions = useCallback(async () => {
    const data = await safeFetchJson(`${API_URL}/transactions/${userId}`, "Transactions fetch");
    setTransactions(data || []); // TEMP FIX: default empty array
  }, [userId, safeFetchJson]);

  // summary
  const fetchSummary = useCallback(async () => {
    const data = await safeFetchJson(`${API_URL}/transactions/summary/${userId}`, "Summary fetch");
    setSummary(data || { balance: 0, income: 0, expenses: 0 }); // TEMP FIX: default zero
  }, [userId, safeFetchJson]);

  // Loads data
  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
      // renders UI
      setTransactions([]);
      setSummary({ balance: 0, income: 0, expenses: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  // Deletes transaction
  const deleteTransaction = useCallback(
    async (id) => {
      if (!id) return;

      try {
        const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });

        if (!response.ok) {
          const text = await response.text();
          console.error("Delete transaction failed:", text);
          Alert.alert("Error", "Failed to delete transaction");
          return;
        }

        await loadData();
        Alert.alert("Success", "Transaction deleted successfully");
      } catch (error) {
        console.error("Error deleting transaction:", error);
        Alert.alert("Error", "Failed to delete transaction. Please check your connection.");
      }
    },
    [loadData]
  );

  // auto loads
  useEffect(() => {
    if (userId) loadData();
  }, [userId, loadData]);

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};