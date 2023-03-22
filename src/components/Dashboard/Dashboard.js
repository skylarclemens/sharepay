import './Dashboard.scss';
import { useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';

const Dashboard = () => {
  const user = useSelector(state => state.user);
  const expenses = useSelector(state => state.expenses);
  const balances = balanceCalc(expenses, user.id);

  return (
    <>
      <div className="dashboard">
        <h2 className="heading">Dashboard</h2>
        <div className="dashboard-container">
          <div className="greeting">
            Hello, <span className="greeting-name">{user.name}</span>!
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
        {expenses.map((expense) => {
          const details = expense.user1.id === user.id ? expense.user1 : expense.user2;
          return (
            <div key={expense.id} className="summary-expense">
              <div className="desc">
                {expense.description}
              </div>
              <div className="transaction">
                <div className="expense-type">{details.type}</div>
                <div className={`expense-amount ${details.type === 'OWE' ? 'expense-amount--owe' : ''}`}>${details.amount.toFixed(2)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  )
}

export default Dashboard;