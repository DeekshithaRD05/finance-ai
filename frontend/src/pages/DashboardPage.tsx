import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { PiggyBank, TrendingDown, TrendingUp, Target, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  created_at: string;
}

const statCards = [
  { label: "Total Savings", icon: PiggyBank, color: "text-success", bgColor: "bg-success/10" },
  { label: "Expenses", icon: TrendingDown, color: "text-destructive", bgColor: "bg-destructive/10" },
  { label: "Investments", icon: TrendingUp, color: "text-info", bgColor: "bg-info/10" },
  { label: "Budget Left", icon: Target, color: "text-primary", bgColor: "bg-primary/10" },
];

export default function DashboardPage() {
  const { profile } = useAuth();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setTransactions(data);
      });
  }, [user]);

  const totalIncome = transactions.reduce((s, t) => t.type === "income" ? s + Number(t.amount) : s, 0);
  const totalExpense = transactions.reduce((s, t) => t.type === "expense" ? s + Number(t.amount) : s, 0);
  const savings = totalIncome - totalExpense;
  const budget = totalIncome > 0 ? totalIncome * 0.3 - totalExpense * 0.3 : 0;

  const values = [savings, totalExpense, Math.round(savings * 0.4), Math.max(0, budget)];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold">
          Welcome, <span className="text-gradient-gold">{profile?.full_name || "User"}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's your financial overview</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className="text-2xl font-display font-bold mt-1">
                      ${Math.abs(values[i]).toLocaleString()}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Recent Transactions</CardTitle>
            <Link to="/expenses" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No transactions yet. Add your first one!</p>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium text-sm">{t.description || t.category}</p>
                      <p className="text-xs text-muted-foreground">{t.category}</p>
                    </div>
                    <span className={`font-semibold text-sm ${t.type === "income" ? "text-success" : "text-destructive"}`}>
                      {t.type === "income" ? "+" : "-"}${Number(t.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md gradient-navy">
          <CardContent className="p-6 flex flex-col justify-center h-full min-h-[200px]">
            <h3 className="text-xl font-display font-bold text-gold mb-2">AI Financial Advisor</h3>
            <p className="text-sidebar-foreground/80 text-sm mb-4">
              Get personalized financial advice, budget plans, and investment suggestions from our AI advisor.
            </p>
            <Link
              to="/chatbot"
              className="inline-flex items-center gap-2 gradient-gold text-primary-foreground px-5 py-2.5 rounded-lg font-semibold shadow-gold hover:opacity-90 transition-opacity w-fit text-sm"
            >
              Start Chat <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
