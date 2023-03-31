import './Dashboard.scss';
import { useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';
import { useEffect } from 'react';

const Dashboard = () => {
  const user = useSelector(state => state.user);
  const expenses = useSelector(state => state.expenses);
  const friends = useSelector(state => state.friends);
  const debts = useSelector(state => state.debts);
  let balances = user ? balanceCalc(debts, user.id) : {total: 0, owed: 0, owe: 0};

  useEffect(() => {
    balances = user ? balanceCalc(debts, user.id) : null;
    console.log('balances');
  }, []);

  return (
    <>
      {user ? (
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
            {debts.map((debt) => {
              let debtType, friendId = '';
              if (debt.creditor_id === user.id) {
                debtType = 'OWED';
                friendId = debt.debtor_id;
              } else {
                debtType = 'OWE';
                friendId = debt.creditor_id;
              }
              console.log(debt.expense_id);
              const currentExpense = expenses.find(expense => expense.id === debt.expense_id);
              const currentFriend = friends.find(friend => friend.id === friendId);
              console.log(currentExpense, currentFriend);
              return (
                <div key={debt.expense_id} className="summary-expense">
                  <div className="desc">
                    {currentExpense.description}
                  </div>
                  <div className="transaction">
                    <div className="expense-type">{debtType}</div>
                    <div className={`expense-amount ${debtType === 'OWE' ? 'expense-amount--owe' : ''}`}>${debt.amount.toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : null }
    </>
  )
}

export default Dashboard;