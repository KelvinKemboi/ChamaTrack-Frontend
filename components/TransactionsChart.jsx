import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

const formatLabel = (label = "") => {
  const [year, month] = label.split("-");
  if (!year || !month) return label;
  return `${month}/${year.slice(2)}`;
};

export default function TransactionsChart({ graphData }) {
  const labels = graphData?.labels || [];
  const income = graphData?.income || [];
  const expenses = graphData?.expenses || [];

  if (!labels.length) {
    return (
      <View style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Income vs Expenses</Text>
        <Text style={styles.chartEmptyText}>No chart data yet.</Text>
      </View>
    );
  }

  const incomeData = labels.map((label, index) => ({
    value: Number(income[index] || 0),
    label: formatLabel(label),
  }));

  const expensesData = labels.map((label, index) => ({
    value: Number(expenses[index] || 0),
    label: formatLabel(label),
  }));

  return (
    <View style={styles.chartCard}>
      <Text style={styles.sectionTitle}>Income vs Expenses</Text>
      <LineChart
        data={incomeData}
        data2={expensesData}
        color={COLORS.income}
        color2={COLORS.expense}
        thickness={3}
        thickness2={3}
        hideDataPoints
        curved
        noOfSections={4}
        yAxisColor={COLORS.border}
        xAxisColor={COLORS.border}
        yAxisTextStyle={{ color: COLORS.textLight }}
        xAxisLabelTextStyle={{ color: COLORS.textLight, fontSize: 11 }}
        spacing={48}
        width={Dimensions.get("window").width - 120}
        isAnimated
      />
    </View>
  );
}
