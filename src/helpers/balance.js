export const balanceCalc = (debts, userId) => {
  let totalBalance = 0;
  let balanceOwed = 0;
  let balanceOwe = 0;
  debts.forEach((debt) => {
    if (debt.paid) return;
    const amount = debt.amount;
    if (debt.creditor_id === userId) {
      totalBalance += amount;
      balanceOwed += amount;
    } else {
      totalBalance -= amount;
      balanceOwe += amount;
    }
  })

  return {
    total: totalBalance,
    owed: balanceOwed,
    owe: balanceOwe
  }
}

export const groupBalanceCalc = (expenses) => {
  let totalBalance = 0;
  expenses.forEach((expense) => {
    if (expense.paid) return;
    totalBalance += expense.amount;
  })
  return totalBalance;
}