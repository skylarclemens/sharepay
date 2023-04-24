import './Transactions.scss';
import Transaction from './Transaction/Transaction';

const Transactions = ({ debts, friend, paid }) => {
  return (
    <div className="transactions">
      {debts.map(debt => {
        const hideDebt = !paid && debt.paid;
        return (
          !hideDebt && (
            <Transaction
              key={debt.id}
              debt={debt}
              paid={paid}
              friend={friend}
            />
          )
        );
      })}
    </div>
  );
};

export default Transactions;
