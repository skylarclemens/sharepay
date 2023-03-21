export const balanceCalc = (expenses) => {
  let totalBalance = 0;
  let balanceOwed = 0;
  let balanceOwe = 0;
  expenses.map((expense) => {
    const amount = Number(expense.amount);
    const halfSplit = amount/2;
    if(expense.split === 'me-split-equally') {
      totalBalance += halfSplit;
      balanceOwed += halfSplit;
    } else if (expense.split === 'them-split-equally') {
      totalBalance -= halfSplit;
      balanceOwe += halfSplit;
    } else if (expense.split === 'me-owed') {
      totalBalance += amount;
      balanceOwed += amount;
    } else if (expense.split === 'them-owed') {
      totalBalance -= amount;
      balanceOwe += amount;
    }
  });
  return {
    total: totalBalance,
    owed: balanceOwed,
    owe: balanceOwe
  }
}