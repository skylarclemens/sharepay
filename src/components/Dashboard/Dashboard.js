import './Dashboard.scss';
import { useDispatch, useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';
import { useEffect, useState } from 'react';
import { fetchExpenses } from '../../slices/expenseSlice';
import { fetchDebts } from '../../slices/debtSlice';
import { fetchFriends } from '../../slices/friendSlice';
import Transactions from '../Transactions/Transactions';

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
            <h2 className="heading">Summary</h2>
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
          <div className="transactions-container">
            <h2 className="heading">Transactions</h2>
            <Transactions debts={debts.data} />
          </div>
        </>
          ) : null }
    </>
  )
}

export default Dashboard;