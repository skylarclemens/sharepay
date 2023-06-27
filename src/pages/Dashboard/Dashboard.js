import './Dashboard.scss';
import { useDispatch, useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';
import { useEffect, useState } from 'react';
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
import Button from '../../components/UI/Buttons/Button/Button';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const user = useSelector(state => state.auth.user);
  const balances = useSelector(state => state.expenses.balances);
  const {
    data: currentAccount,
  } = useGetAccountQuery(user?.id);
  const balanceTabs = [
    { id: 'total', label: 'Total balance' },
    { id: 'owed', label: 'Owed' },
    { id: 'owe', label: 'Owe' },
  ];
  const [balanceTab, setBalanceTab] = useState(balanceTabs[0].id);

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
        className="header--transparent"
        left={
          <Link to="/account">
            <Avatar url={currentAccount?.avatar_url} size={28} classes="white-border"/>
          </Link>
        } />
        <>
          <Refresh onRefresh={onRefresh} />
          <div className="dashboard">
            <div className="details-background"></div>
            <div className="balance-container">
              <div className="balance-tabs">
                {balanceTabs.map((tab) => {
                  return (
                    <Button key={tab.id} className={`button--text balance-tab balance--${tab.id} ${balanceTab === tab.id && 'active'}`} onClick={() => setBalanceTab(tab.id)}>
                      {tab.label}
                      {balanceTab === tab.id ? (
                        <>
                          <motion.span layoutId="tab-bubble" className="active-tab"
                            transition={{
                              type: 'spring',
                              bounce: 0.1,
                              duration: 0.6
                            }}></motion.span>
                          <motion.span layoutId="tab-bubble-behind" className="active-tab--behind"
                            transition={{
                              type: 'spring',
                              bounce: 0.1,
                              duration: 0.6
                            }}></motion.span>
                        </>
                      ) : null}
                    </Button>
                  )
                })}
              </div>
              <div className="balance">
                {!debtsFetched || debtsLoading ? (
                  <Skeleton width="180px" height="60px" />
                ) : (
                  <>
                    <span className={`balance-amount balance--${balanceTab}`}>
                      {balanceTab === 'total' ? formatMoney(balances?.total) : 
                      balanceTab === 'owed' ? formatMoney(balances?.owed, false) : 
                      formatMoney(balances?.owe, false)}
                    </span>
                  </> 
                )}
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
