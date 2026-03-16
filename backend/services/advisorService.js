export async function getAdvice(message) {

  const text = message.toLowerCase();

  if (text.includes("save")) {
    return "💰 Save at least 20% of your income every month.";
  }

  if (text.includes("investment")) {
    return "📈 Consider mutual funds, index funds, or fixed deposits depending on your risk tolerance.";
  }

  if (text.includes("loan")) {
    return "🏦 Always compare interest rates before taking a loan.";
  }

  if (text.includes("budget")) {
    return "📊 Follow the 50-30-20 rule: 50% needs, 30% wants, 20% savings.";
  }

  return "I can help you with savings, investments, budgeting and loans.";
}