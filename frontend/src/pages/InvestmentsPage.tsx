import { motion } from "framer-motion";
import { Shield, TrendingUp, Flame, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const investmentOptions = [
  {
    risk: "Low Risk",
    icon: Shield,
    color: "text-success",
    bg: "bg-success/10",
    borderColor: "border-success/30",
    description: "Safe investments with stable returns",
    options: [
      { name: "Fixed Deposits", returns: "5-7%", minAmount: "$1,000" },
      { name: "Government Bonds", returns: "6-8%", minAmount: "$5,000" },
      { name: "Treasury Bills", returns: "4-5%", minAmount: "$1,000" },
      { name: "Savings Account", returns: "3-4%", minAmount: "$100" },
    ],
  },
  {
    risk: "Medium Risk",
    icon: TrendingUp,
    color: "text-info",
    bg: "bg-info/10",
    borderColor: "border-info/30",
    description: "Balanced risk-return investments",
    options: [
      { name: "Index Funds (S&P 500)", returns: "8-12%", minAmount: "$500" },
      { name: "Mutual Funds", returns: "10-15%", minAmount: "$1,000" },
      { name: "REITs", returns: "8-12%", minAmount: "$2,000" },
      { name: "ETFs", returns: "7-10%", minAmount: "$100" },
    ],
  },
  {
    risk: "High Risk",
    icon: Flame,
    color: "text-destructive",
    bg: "bg-destructive/10",
    borderColor: "border-destructive/30",
    description: "High potential returns with higher risk",
    options: [
      { name: "Individual Stocks", returns: "15-25%+", minAmount: "$100" },
      { name: "Cryptocurrency", returns: "Variable", minAmount: "$50" },
      { name: "Options Trading", returns: "20%+", minAmount: "$2,000" },
      { name: "Startup Investments", returns: "30%+", minAmount: "$10,000" },
    ],
  },
];

export default function InvestmentsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold">Investment Suggestions</h1>
        <p className="text-muted-foreground mt-1">Choose investments based on your risk tolerance</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {investmentOptions.map((category, ci) => (
          <motion.div key={category.risk} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.15 }}>
            <Card className={`border shadow-md h-full ${category.borderColor}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${category.bg} flex items-center justify-center`}>
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg">{category.risk}</CardTitle>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.options.map((opt) => (
                  <div key={opt.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{opt.name}</p>
                      <p className="text-xs text-muted-foreground">Min: {opt.minAmount}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-semibold ${category.color}`}>{opt.returns}</span>
                      <p className="text-xs text-muted-foreground">Annual</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-0 shadow-md gradient-navy">
        <CardContent className="p-6">
          <h3 className="text-lg font-display font-bold text-gold mb-2">💡 Investment Tips</h3>
          <ul className="text-sidebar-foreground/80 text-sm space-y-2">
            <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" /> Diversify across risk levels</li>
            <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" /> Start with low-risk if you're a beginner</li>
            <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" /> Invest only what you can afford to lose</li>
            <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" /> Review and rebalance quarterly</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
