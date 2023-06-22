import './Dashboard.scss';
import { useDispatch, useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { selectAllFriendExpenses, setBalances, useGetExpensesQuery } from '../../slices/expenseSlice';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';
import Transactions from '../../components/Transactions/Transactions';
import Refresh from '../../components/Refresh/Refresh';
import { formatMoney } from '../../helpers/money';
import { useGetDebtsQuery } from '../../slices/debtSlice';
import { useGetGroupsQuery } from '../../slices/groupSlice';
import GroupExpenses from './GroupExpenses/GroupExpenses';
import Avatar from '../../components/Avatar/Avatar';
import { useGetAccountQuery } from '../../slices/accountSlice';
import Skeleton from '../../components/Skeleton/Skeleton';

const Dashboard = () => {
  const user = useSelector(state => state.auth.user);
  const balances = useSelector(state => state.expenses.balances);
  const {
    data: currentAccount,
  } = useGetAccountQuery(user?.id);

  const {
    data: debts,
    isLoading: debtsLoading,
    isSuccess: debtsFetched,
    refetch: refetchDebts
  } = useGetDebtsQuery(user?.id);
  const {
    isSuccess: expensesFetched,
    isLoading: expensesLoading,
    refetch: refetchExpenses
  } = useGetExpensesQuery();
  const {
    data: groups,
    isSuccess: groupsFetched,
    refetch: refetchGroups
  } = useGetGroupsQuery(user?.id);
  const friendExpenses = useSelector(state => selectAllFriendExpenses(state));
  const unpaidFriendExpenses = friendExpenses.filter(expense => !expense?.paid);

  const onRefresh = () => {
    refetchDebts();
    refetchExpenses();
    refetchGroups();
  }

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
      <MainHeader
        title="Dashboard"
        right={
          <Link to="/account">
            <Avatar url={currentAccount?.avatar_url} size={28} classes="white-border"/>
          </Link>
        } />
        <>
          <Refresh onRefresh={onRefresh} />
          <div className="dashboard">
            <div className="details-background"></div>
            <div className="details-container">
              <div className="balance">
                <div className="balance-block balance-block--total">
                  <h3>YOUR BALANCE</h3>
                  <span
                    className="total"
                  >
                    {!debtsFetched || debtsLoading ? (
                      <Skeleton width="130px" height="36px" />
                    ) : (
                      formatMoney(balances?.total)
                    )}
                  </span>
                </div>
                <div className="secondary-balance">
                  <div className="balance-block balance-block--green">
                    <h3>YOU'RE OWED</h3>
                    <span className="secondary-amount">
                    {!debtsFetched || debtsLoading ? (
                      <Skeleton width="57px" height="20px" />
                    ) : (
                      `$${balances?.owed.toFixed(2) || 0.00}`
                    )}
                    </span>
                  </div>
                  <div className="balance-block balance-block--red">
                    <h3>YOU OWE</h3>
                    <span className="secondary-amount">
                      {!debtsFetched || debtsLoading ? (
                        <Skeleton width="57px" height="20px" />
                      ) : (
                        `$${balances?.owe.toFixed(2) || 0.00}`
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="transactions-container">
              <h2 className="main-heading">Recent Transactions</h2>
              <div className="recent-transactions">
                {!expensesFetched || expensesLoading ? (
                  <Skeleton width="100%" height="56px">
                    <div className="skeleton__avatar"></div>
                  </Skeleton>
                ) : (
                  unpaidFriendExpenses.length > 0 &&
                  <Transactions transactions={unpaidFriendExpenses.splice(0,5)} />
                )}
                {(groupsFetched && groups.length > 0) &&
                  groups.map(group => {
                    return <GroupExpenses key={group.id} group={group} />
                  })}
              </div>
            </div>
          </div>
        </>
    </>
  );
};

export default Dashboard;
