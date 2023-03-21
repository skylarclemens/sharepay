import './Dashboard.scss';
import { useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';

const Dashboard = () => {
  const user = useSelector(state => state.user);
  const expenses = useSelector(state => state.expenses);
  const balances = balanceCalc(expenses);

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
      <div>
        <h2 className="heading">Summary</h2>
      </div>
    </>
  )
}

export default Dashboard;