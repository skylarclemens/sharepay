import './Transactions.scss';
import Transaction from './Transaction/Transaction';

const Transactions = ({ debts, friend, paid }) => {
  return (
    <div className="transactions">
      {debts.map((debt) => {
        if(!paid && debt.paid) return;
        return <Transaction key={debt.id} debt={debt} paid={paid} friend={friend} />
      })}
    </div>
  )
}

export default Transactions;