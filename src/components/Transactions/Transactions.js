import './Transactions.scss';
import ExpenseTransaction from './ExpenseTransaction/ExpenseTransaction';

const Transactions = ({ transactions, showPaid = false }) => {
  return (
    <div className="transactions">
      {transactions?.map(transaction => {
        const hideDebt = !showPaid && transaction?.paid;
        if (hideDebt) return null;
        return (
          <ExpenseTransaction
            key={transaction?.id}
            transaction={transaction}
          />
        );
      })}
    </div>
  );
};

export default Transactions;
