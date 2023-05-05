import './Transactions.scss';
import Transaction from './Transaction/Transaction';

const Transactions = ({ transactions, showPaid = false }) => {
  return (
    <div className="transactions">
      {transactions?.map(transaction => {
        const hideDebt = !showPaid && transaction?.paid;
        if (hideDebt) return null;
        return (
          <Transaction
            key={transaction?.id}
            transaction={transaction}
          />
        );
      })}
    </div>
  );
};

export default Transactions;
