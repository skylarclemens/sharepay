import './Transaction.scss';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar/Avatar';

const Transaction = ({ debt, paid, friend }) => {
  const account = useSelector(state => state.account.data);
  const expenses = useSelector(state => state.expenses.data);
  const friends = useSelector(state => state.friends.data);

  let debtType, userCreditor, userDebtor = '';
  if (debt?.creditor_id === account?.id) {
    debtType = 'OWED';
    userCreditor = account;
    userDebtor = friend || friends.find(friend => friend.id === debt.debtor_id);
  } else {
    debtType = 'OWE';
    userCreditor = friend || friends.find(friend => friend.id === debt.creditor_id);
    userDebtor = account;
  }
  const currentExpense = expenses.find(expense => expense?.id === debt.expense_id);

  return (
    currentExpense && (
    <Link className="expense-link" key={debt.expense_id} to={`/expense/${debt.expense_id}`}>
      <div className="transaction-expense">
          <div className="expense-avatars">
            <Avatar url={userCreditor?.avatar_url} size={40} />
            <Avatar url={userDebtor?.avatar_url} size={40} />
          </div>
          <div className="desc">
            {currentExpense?.description}
          </div>
          {paid && <div className="debt-paid">PAID UP</div>}
          {!paid && <>
            <div className="transaction">
              <div className="expense-type">{debtType}</div>
              <div className={`expense-amount ${debtType === 'OWE' ? 'expense-amount--owe' : ''}`}>${debt.amount.toFixed(2)}</div>
            </div>
          </>}
          <div className="arrow arrow--right"></div>
      </div>
    </Link>
  ));
}

export default Transaction;