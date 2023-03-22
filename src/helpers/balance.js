export const balanceCalc = (expenses, userId) => {
  let totalBalance = 0;
  let balanceOwed = 0;
  let balanceOwe = 0;
  expenses.map((expense) => {
    const details = expense.user1.id === userId ? expense.user1 : expense.user2;
    if (details.type === 'OWED') {
      totalBalance += details.amount;
      balanceOwed += details.amount;
    } else if (details.type === 'OWE') {
      totalBalance -= details.amount;
      balanceOwe += details.amount;
    }
  });
  return {
    total: totalBalance,
    owed: balanceOwed,
    owe: balanceOwe
  }
}