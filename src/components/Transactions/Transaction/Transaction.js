import './Transaction.scss';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar/Avatar';
import { useGetFriendQuery } from '../../../slices/friendSlice';
import { useGetExpenseQuery } from '../../../slices/expenseSlice';
import { useGetAccountQuery } from '../../../slices/accountSlice';

const Transaction = ({ debt, paid }) => {
  const user = useSelector(state => state.auth.user);
  const {
    data: currentExpense,
    isSuccess
  } = useGetExpenseQuery(debt.expense_id);
  
  const {
    data: account
  } = useGetAccountQuery(user?.id);

  let friendId,
    debtType,
    userCreditor,
    userDebtor = '';
  if (currentExpense?.payer_id === account?.id) {
    debtType = 'OWED';
    friendId = debt?.debtor_id;
  } else {
    debtType = 'OWE';
    friendId = debt?.creditor_id;
  }

  const {
    data: currentFriend,
  } = useGetFriendQuery(friendId);

  if(debtType === 'OWED') {
    userCreditor = account;
    userDebtor = currentFriend;
  } else {
    userCreditor = currentFriend;
    userDebtor = account;
  }

  return (
    isSuccess && (
      <Link
        className="expense-link"
        to={`/expense/${debt?.expense_id}`}
      >
        <div className={`transaction ${
            debtType === 'OWE' ? 'transaction--owe' : ''
          }`}>
          <div className="expense-avatars">
            <Avatar url={userCreditor?.avatar_url} classes="white-border" size={40} />
            <Avatar url={userDebtor?.avatar_url} classes="white-border" size={40} />
          </div>
          <div className="desc">{currentExpense?.description}</div>
          {paid && <div className="debt-paid">PAID UP</div>}
          {!paid && (
            <>
              <div className="transaction-amount">
                <div
                  className={`expense-amount ${
                    debtType === 'OWE' ? 'expense-amount--owe' : ''
                  }`}
                >
                  ${debt?.amount.toFixed(2)}
                </div>
              </div>
              <div className="arrow arrow--right"></div>
            </>
          )}
        </div>
      </Link>
    )
  );
};

export default Transaction;
