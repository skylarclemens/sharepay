import './Dashboard.scss';
import { useDispatch, useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';
import { useEffect } from 'react';
import { setBalances } from '../../slices/expenseSlice';
import { fetchFriends } from '../../slices/friendSlice';
import Transactions from '../../components/Transactions/Transactions';
import { fetchGroups } from '../../slices/groupSlice';
import { formatMoney } from '../../helpers/money';

import { useGetDebtsQuery } from '../../slices/debtSlice';

const Dashboard = () => {
  const {
    data: debts,
    isSuccess
  } = useGetDebtsQuery();
  const user = useSelector(state => state.auth.user);
  const friends = useSelector(state => state.friends);
  const groups = useSelector(state => state.groups);
  const balances = useSelector(state => state.expenses.balances);

  const dispatch = useDispatch();

  const dataLoaded =
    user &&
    isSuccess &&
    friends.status === 'succeeded' &&
    groups.status === 'succeeded';

  useEffect(() => {
    if (dataLoaded) {
      dispatch(setBalances(balanceCalc(debts, user?.id)));
    }
  }, [dataLoaded, debts, user.id, dispatch]);

  useEffect(() => {
    if(friends.status === 'idle') {
      dispatch(fetchFriends(user.id));
    }
  }, [user, friends, dispatch]);

  useEffect(() => {
    if(groups.status === 'idle') {
      dispatch(fetchGroups(user.id));
    }
  }, [user, groups, dispatch]);

  return (
    <>
      {dataLoaded ? (
        <div className="dashboard">
          <div className="details-container">
            <div className="balance">
              <div className="balance-block balance-block--total">
                <h3>YOUR BALANCE</h3>
                <span
                  className="total"
                >
                  {formatMoney(balances?.total)}
                </span>
              </div>
              <div className="secondary-balance">
                <div className="balance-block balance-block--green">
                  <h3>YOU'RE OWED</h3>
                  <span className="secondary-amount">${balances?.owed.toFixed(2) || 0.0}</span>
                </div>
                <div className="balance-block balance-block--red">
                  <h3>YOU OWE</h3>
                  <span className="secondary-amount">${balances?.owe.toFixed(2) || 0.0}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="transactions-container">
            <h2 className="main-heading">Recent Transactions</h2>
            <Transactions debts={debts} paid={false} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Dashboard;
