import './Transactions.scss';
import Transaction from './Transaction/Transaction';

const Transactions = ({ debts, paid }) => {
  return (
    <div className="transactions">
      {debts?.map(debt => {
        const hideDebt = !paid && debt?.paid;
        return (
          !hideDebt && (
            <Transaction
              key={debt?.id}
              debt={debt}
              paid={paid}
            />
          )
        );
      })}
    </div>
  );
};

export default Transactions;
