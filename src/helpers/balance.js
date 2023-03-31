export const balanceCalc = (debts, userId) => {
  let totalBalance = 0;
  let balanceOwed = 0;
  let balanceOwe = 0;
  debts.map((debt) => {
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