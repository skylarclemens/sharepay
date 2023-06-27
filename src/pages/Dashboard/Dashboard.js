import './Dashboard.scss';
import { useDispatch, useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { setBalances, useGetExpensesQuery } from '../../slices/expenseSlice';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';
import SimpleTransaction from '../../components/Transactions/SimpleTransaction/SimpleTransaction';
import Refresh from '../../components/Refresh/Refresh';
import { formatMoney } from '../../helpers/money';
import { useGetDebtsQuery, useGetDebtsWithExpensesQuery } from '../../slices/debtSlice';
import { useGetGroupsQuery } from '../../slices/groupSlice';
import GroupExpenses from './GroupExpenses/GroupExpenses';
import Avatar from '../../components/Avatar/Avatar';
import { useGetAccountQuery } from '../../slices/accountSlice';
import Skeleton from '../../components/Skeleton/Skeleton';
import Tabs from '../../components/UI/Tabs/Tabs';

const Dashboard = () => {
  const user = useSelector(state => state.auth.user);
  const balances = useSelector(state => state.expenses.balances);
  const {
    data: currentAccount,
  } = useGetAccountQuery(user?.id);
  const balanceTabs = [
    { id: 'all', label: 'All' },
    { id: 'owed', label: 'Owed' },
    { id: 'owe', label: 'Owe' },
  ];
  const [balanceTab, setBalanceTab] = useState(balanceTabs[0].id);

  const {
    data: debts,
    isSuccess: debtsFetched,
    refetch: refetchDebts
  } = useGetDebtsQuery(user?.id);
  const {
    data: debtsWithExpenses,
    isLoading: debtsWithExpensesLoading,
    isSuccess: debtsWithExpensesFetched,
    refetch: refetchDebtsWithExpenses
  } = useGetDebtsWithExpensesQuery(user?.id);
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
  const unpaidUserDebts = debtsWithExpenses?.filter(debt => !debt?.paid && debt?.debtor_id === user?.id);
  const unpaidFriendDebts = debtsWithExpenses?.filter(debt => !debt?.paid && debt?.creditor_id === user?.id);
  const allUnpaidDebts = debtsWithExpenses?.filter(debt => !debt?.paid);

  const onRefresh = () => {
    refetchDebtsWithExpenses();
    refetchDebts();
    refetchExpenses();
    refetchGroups();
  }

  const dispatch = useDispatch();

  const dataLoaded =
    user &&
    debtsFetched &&
    debtsWithExpensesFetched;

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
              <Tabs tabs={balanceTabs} selected={balanceTab} setSelected={setBalanceTab}
                style={{ 
                  background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.20) 12.50%, rgba(106, 155, 93, 0.20) 46.88%, rgba(220, 85, 55, 0.20) 84.90%), rgba(0, 0, 0, 0.10)'
                 }} />
              <div className="balance">
                {!debtsWithExpensesFetched || debtsWithExpensesLoading ? (
                  <Skeleton width="180px" height="60px" />
                ) : (
                  <>
                    <span className={`balance-amount balance--${balanceTab}`}>
                      {balanceTab === 'all' ? formatMoney(balances?.total) : 
                      balanceTab === 'owed' ? formatMoney(balances?.owed, false) : 
                      formatMoney(balances?.owe, false)}
                    </span>
                  </> 
                )}
              </div>
            </div>
            <div className="transactions-container">
              <h2 className="main-heading">Transactions</h2>
              <div className="recent-transactions">
                {!expensesFetched || expensesLoading ? (
                  <Skeleton width="100%" height="56px">
                    <div className="skeleton__avatar"></div>
                  </Skeleton>
                ) : (
                  balanceTab === 'all' && allUnpaidDebts?.length > 0 ?
                  allUnpaidDebts?.splice(0,5)?.map(debt => {
                    return (
                      <SimpleTransaction
                        key={debt?.id}
                        to={`/expense/${debt?.expense?.id}`}
                        description={debt?.expense?.description}
                        date={debt?.expense?.date}
                        amount={`${debt?.creditor_id === user?.id ? '+' : '-'}${formatMoney(debt?.amount, false)}`}
                        category={debt?.expense?.category}
                        transactionType={debt?.creditor_id === user?.id ? 'owed' : 'owe'}
                      />
                    )}) :
                  balanceTab === 'owed' && unpaidFriendDebts?.length > 0 ?
                  unpaidFriendDebts?.splice(0,5)?.map(debt => {
                    return (
                      <SimpleTransaction
                        key={debt?.id}
                        to={`/expense/${debt?.expense?.id}`}
                        description={debt?.expense?.description}
                        date={debt?.expense?.date}
                        amount={formatMoney(debt?.amount, false)}
                        category={debt?.expense?.category}
                        transactionType={'owed'}
                      />
                    )}) :
                  balanceTab === 'owe' && unpaidUserDebts?.length > 0 ?
                  unpaidUserDebts?.splice(0,5)?.map(debt => {
                    return (
                      <SimpleTransaction
                        key={debt?.id}
                        to={`/expense/${debt?.expense?.id}`}
                        description={debt?.expense?.description}
                        date={debt?.expense?.date}
                        amount={formatMoney(debt?.amount, false)}
                        category={debt?.expense?.category}
                        transactionType={'owe'}
                      />
                    )}) :
                    null
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
