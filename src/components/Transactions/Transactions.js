import './Transactions.scss';
import ExpenseTransaction from './ExpenseTransaction/ExpenseTransaction';
import DebtTransaction from './DebtTransaction/DebtTransaction';

const Transactions = ({ transactions, showPaid = false, type = 'expense' }) => {

  return (
    <div className="transactions">
      {transactions?.map(transaction => {
        const hideDebt = !showPaid && transaction?.paid;
        if (hideDebt) return null
        if (type === 'expense') {
          return (
            <ExpenseTransaction
              key={transaction?.id}
              transaction={transaction}
            />
          )
        } else if (type === 'debt') {
          return (
            <DebtTransaction
              key={transaction?.id}
              transaction={transaction}
            />
          )
        }
        return null
      })}
    </div>
  );
};

export default Transactions;
