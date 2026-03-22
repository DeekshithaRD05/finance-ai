import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Transaction {
  type: "income" | "expense";
  amount: number;
  category: string;
  created_at: string;
}

const COLORS = ["#d4a017", "#2563eb", "#10b981", "#ef4444", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4"];

export default function ReportsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("transactions").select("type, amount, category, created_at").eq("user_id", user.id)
      .then(({ data }) => { if (data) setTransactions(data); });
  }, [user]);

  const expenses = transactions.filter(t => t.type === "expense");

  // Group by category for pie chart
  const categoryData = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {});
  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  // Monthly bar chart data
  const monthlyData = transactions.reduce<Record<string, { income: number; expense: number }>>((acc, t) => {
    const month = new Date(t.created_at).toLocaleString("default", { month: "short", year: "2-digit" });
    if (!acc[month]) acc[month] = { income: 0, expense: 0 };
    acc[month][t.type] += Number(t.amount);
    return acc;
  }, {});
  const barData = Object.entries(monthlyData).map(([month, data]) => ({ month, ...data }));

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = expenses.reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold">Financial Reports</h1>
        <p className="text-muted-foreground mt-1">Visualize your financial data</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Income", value: totalIncome, color: "text-success" },
          { label: "Total Expenses", value: totalExpense, color: "text-destructive" },
          { label: "Net Savings", value: totalIncome - totalExpense, color: "text-primary" },
        ].map((s, i) => (
          <Card key={s.label} className="border-0 shadow-md">
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className={`text-3xl font-display font-bold ${s.color}`}>${s.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="font-display">Monthly Income vs Expenses</CardTitle></CardHeader>
          <CardContent>
            {barData.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">Add transactions to see charts</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 88%)" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader><CardTitle className="font-display">Expense by Category</CardTitle></CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">Add expenses to see breakdown</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
