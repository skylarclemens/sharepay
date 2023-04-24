export const formatMoney = (amount, setSign = true) => {
  let sign = '';
  if (amount < 0) {
    sign = '-';
  } else if (amount > 0) {
    sign = '+';
  }
  if (!setSign) sign = '';
  return `${sign}$${Math.abs(Number(amount)).toFixed(2)}`;
};
