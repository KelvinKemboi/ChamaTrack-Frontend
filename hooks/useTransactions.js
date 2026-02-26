import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api.js";

const buildGraphDataFromTransactions = (items = []) => {
  const grouped = {};

  items.forEach((tx) => {
    const rawDate = tx?.created_at;
    const date = rawDate ? new Date(rawDate) : null;
    if (!date || Number.isNaN(date.getTime())) return;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const key = `${year}-${month}`;
    const amount = Number(tx?.amount || 0);

    if (!grouped[key]) grouped[key] = { income: 0, expenses: 0 };

    if (amount > 0) grouped[key].income += amount;
    if (amount < 0) grouped[key].expenses += Math.abs(amount);
  });

  const labels = Object.keys(grouped).sort();
  return {
    labels,
    income: labels.map((label) => grouped[label].income),
    expenses: labels.map((label) => grouped[label].expenses),
  };
};

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [graphData, setGraphData] = useState({
    labels: [],
    income: [],
    expenses: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // fetches helper with safe fail
  const safeFetchJson = useCallback(async (url, actionName = "Fetch", { showAlert = true } = {}) => {
    if (!userId) return null;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const text = await response.text();
        console.error(`${actionName} failed:`, text);
        if (showAlert) {
          Alert.alert("Error", `${actionName} failed. Returning empty data.`);
        }
        return null; // allow app to continue
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`${actionName} exception:`, error);
      if (showAlert) {
        Alert.alert("Error", `${actionName} failed. Returning empty data.`);
      }
      return null; // allow app to continue
    }
  }, [userId]);

  // transactions
  const fetchTransactions = useCallback(async () => {
    const data = await safeFetchJson(`${API_URL}/transactions/${userId}`, "Transactions fetch");
    const result = data || [];
    setTransactions(result); // TEMP FIX: default empty array
    return result;
  }, [userId, safeFetchJson]);

  // summary
  const fetchSummary = useCallback(async () => {
    const data = await safeFetchJson(`${API_URL}/transactions/summary/${userId}`, "Summary fetch");
    setSummary(data || { balance: 0, income: 0, expenses: 0 }); // TEMP FIX: default zero
  }, [userId, safeFetchJson]);

  // graph
  const fetchGraphData = useCallback(async (fallbackTransactions = []) => {
    const data = await safeFetchJson(
      `${API_URL}/transactions/graph/${userId}`,
      "Graph data fetch",
      { showAlert: false }
    );

    if (data) {
      setGraphData(data);
      return;
    }

    setGraphData(buildGraphDataFromTransactions(fallbackTransactions));
  }, [userId, safeFetchJson]);

  // Loads data
  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const [txns] = await Promise.all([fetchTransactions(), fetchSummary()]);
      await fetchGraphData(txns || []);
    } catch (error) {
      console.error("Error loading data:", error);
      // renders UI
      setTransactions([]);
      setSummary({ balance: 0, income: 0, expenses: 0 });
      setGraphData({ labels: [], income: [], expenses: [] });
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, fetchGraphData, userId]);

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

  return { transactions, summary, graphData, isLoading, loadData, deleteTransaction };
};
