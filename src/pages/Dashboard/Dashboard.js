import './Dashboard.scss';
import { useDispatch, useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';
import { useEffect } from 'react';
import { selectAllFriendExpenses, setBalances, useGetExpensesQuery } from '../../slices/expenseSlice';
import Header from '../../components/Header/Header';
import Transactions from '../../components/Transactions/Transactions';
import Refresh from '../../components/Refresh/Refresh';
import { formatMoney } from '../../helpers/money';
import { useGetDebtsQuery } from '../../slices/debtSlice';
import { useGetGroupsQuery } from '../../slices/groupSlice';
import GroupExpenses from './GroupExpenses/GroupExpenses';

const Dashboard = () => {
  const user = useSelector(state => state.auth.user);
  const balances = useSelector(state => state.expenses.balances);

  const {
    data: debts,
    isSuccess: debtsFetched
  } = useGetDebtsQuery();
  const {
    isSuccess: expensesFetched
  } = useGetExpensesQuery();
  const {
    data: groups,
    isSuccess: groupsFetched
  } = useGetGroupsQuery(user?.id);
  const friendExpenses = useSelector(state => selectAllFriendExpenses(state));
  const unpaidFriendExpenses = friendExpenses.filter(expense => !expense?.paid);

  const dispatch = useDispatch();

  const dataLoaded =
    user &&
    debtsFetched;

  useEffect(() => {
    if (dataLoaded) {
      dispatch(setBalances(balanceCalc(debts, user?.id)));
    }
  }, [dataLoaded, debts, user.id, dispatch]);

  return (
    <>
      <Header type="main" title="Dashboard" />
      {dataLoaded ? (
        <>
          <Refresh />
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
              {(expensesFetched && unpaidFriendExpenses.length > 0) && <Transactions transactions={unpaidFriendExpenses} />}
              {(groupsFetched && groups.length > 0) &&
                groups.map(group => {
                  return <GroupExpenses key={group.id} group={group} />
                })}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Dashboard;
