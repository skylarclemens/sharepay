import './Dashboard.scss';
import { useDispatch, useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { setBalances } from '../../slices/expenseSlice';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';
import Refresh from '../../components/Refresh/Refresh';
import { formatMoney } from '../../helpers/money';
import { useGetDebtsWithExpensesQuery } from '../../slices/debtSlice';
import Avatar from '../../components/Avatar/Avatar';
import { useGetAccountQuery } from '../../slices/accountSlice';
import Skeleton from '../../components/Skeleton/Skeleton';
import Tabs from '../../components/UI/Tabs/Tabs';
import DashboardTabs from './DashboardTabs/DashboardTabs';

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
    data: debtsWithExpenses,
    isLoading: debtsWithExpensesLoading,
    isSuccess: debtsWithExpensesFetched,
    refetch: refetchDebtsWithExpenses
  } = useGetDebtsWithExpensesQuery(user?.id);

  const onRefresh = () => {
    refetchDebtsWithExpenses();
  }

  const dispatch = useDispatch();

  const dataLoaded =
    user &&
    (debtsWithExpensesFetched || !debtsWithExpensesLoading);

  useEffect(() => {
    if (dataLoaded) {
      dispatch(setBalances(balanceCalc(debtsWithExpenses, user?.id)));
    }
  }, [dataLoaded, debtsWithExpenses, user.id, dispatch]);

  return (
    <>
      <MainHeader
        title="Dashboard"
        className="header--transparent"
        style={{
          background: '#51754C',
        }}
        left={
          <Link to="/account">
            <Avatar url={currentAccount?.avatar_url} size={28} classes="white-border"/>
          </Link>
        }
      />
      <Refresh onRefresh={onRefresh} />
      <div className="dashboard">
        <div className="balance-container">
          <Tabs tabs={balanceTabs}
            selected={balanceTab}
            setSelected={setBalanceTab}
            style={{ 
              background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.20) 12.50%, rgba(106, 155, 93, 0.20) 46.88%, rgba(220, 85, 55, 0.20) 84.90%), rgba(0, 0, 0, 0.10)'
              }}
          />
          <div className="balance">
            {!dataLoaded ? (
              <Skeleton width="180px" height="60px" />
            ) : (
              <span className={`balance-amount balance--${balanceTab}`}>
                {balanceTab === 'all' ? formatMoney(balances?.total) : 
                balanceTab === 'owed' ? formatMoney(balances?.owed, false) : 
                formatMoney(balances?.owe, false)}
              </span>
            )}
          </div>
        </div>
        <div className="transactions-container">
          <DashboardTabs
            currentTab={balanceTab}
            debts={debtsWithExpenses}
            user={user}
            debtsLoaded={dataLoaded}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
