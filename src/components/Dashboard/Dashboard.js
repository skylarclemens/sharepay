import './Dashboard.scss';
import { useDispatch, useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';
import { useEffect, useState } from 'react';
import { fetchExpenses } from '../../slices/expenseSlice';
import { fetchDebts } from '../../slices/debtSlice';
import { fetchFriends } from '../../slices/friendSlice';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar/Avatar';

const Dashboard = () => {
  const user = useSelector(state => state.user);
  const account = useSelector(state => state.account);
  const expenses = useSelector(state => state.expenses);
  const friends = useSelector(state => state.friends);
  const debts = useSelector(state => state.debts);
  const [balances, setBalances] = useState({total: 0, owed: 0, owe: 0});
  const dispatch = useDispatch();

  const dataLoaded = user && debts.status === 'succeeded' && friends.status === 'succeeded' && expenses.status === 'succeeded';

  useEffect(() => {
    dataLoaded && setBalances(balanceCalc(debts.data, user.id));
  }, [dataLoaded, debts.data, user.id]);

  useEffect(() => {
    dispatch(fetchDebts(user.id));
    dispatch(fetchExpenses(user.id));
    dispatch(fetchFriends(user.id));
  }, [user, dispatch]);

  return (
    <>
      {dataLoaded ? (
        <>
          <div className="dashboard">
            <h2 className="heading">Dashboard</h2>
            <div className="dashboard-container">
              <div className="greeting">
                Hello, <span className="greeting-name">{user.user_metadata.name}</span>!
              </div>
              <div className="balance">
                <div className="balance-block balance-block--total">
                  <h3>TOTAL BALANCE</h3>
                  <span>${balances.total.toFixed(2) || 0.00}</span>
                </div>
                <div className="secondary-balance">
                  <div className="balance-block balance-block--green">
                    <h3>YOU'RE OWED</h3>
                    <span>${balances.owed.toFixed(2) || 0.00}</span>
                  </div>
                  <div className="balance-block balance-block--red">
                    <h3>YOU OWE</h3>
                    <span>${balances.owe.toFixed(2) || 0.00}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="summary">
            <h2 className="heading">Summary</h2>
            {debts.data.map((debt) => {
              let debtType, friendId = '';
              if (debt.creditor_id === user.id) {
                debtType = 'OWED';
                friendId = debt.debtor_id;
              } else {
                debtType = 'OWE';
                friendId = debt.creditor_id;
              }
              const currentExpense = expenses.data.find(expense => expense.id === debt.expense_id);
              const currentFriend = friends.data.find(friend => friend.id === friendId);
              return (
                <Link className="expense-link" key={debt.expense_id} to={`/expense/${debt.expense_id}`}>
                  <div className="summary-expense">
                      <div className="expense-avatars">
                        <Avatar url={account.data.avatar_url} size={40} />
                        <Avatar url={currentFriend.avatar_url} size={40} />
                      </div>
                      <div className="desc">
                        {currentExpense.description}
                      </div>
                      <div className="transaction">
                        <div className="expense-type">{debtType}</div>
                        <div className={`expense-amount ${debtType === 'OWE' ? 'expense-amount--owe' : ''}`}>${debt.amount.toFixed(2)}</div>
                      </div>
                      <div className="arrow arrow--right"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
          ) : null }
    </>
  )
}

export default Dashboard;