export const formatMoney = (amount) => {
  let sign = '';
  if (amount < 0) {
    sign = '-'
  } else if (amount > 0) {
    sign = '+'
  }
  return `${sign}$${Math.abs(Number(amount)).toFixed(2)}`;
}