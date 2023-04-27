import './Dashboard.scss';
import { useDispatch, useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';
import { useEffect } from 'react';
import { fetchExpenses, setBalances, getExpenseStatus } from '../../slices/expenseSlice';
import { fetchDebts, selectAllDebts, getDebtStatus } from '../../slices/debtSlice';
import { fetchFriends } from '../../slices/friendSlice';
import Transactions from '../../components/Transactions/Transactions';
import { fetchGroups } from '../../slices/groupSlice';
import { formatMoney } from '../../helpers/money';

const Dashboard = () => {
  const user = useSelector(state => state.user);
  const expensesStatus = useSelector(getExpenseStatus);
  const friends = useSelector(state => state.friends);
  const debtsStatus = useSelector(getDebtStatus);
  const debts = useSelector(selectAllDebts);
  const groups = useSelector(state => state.groups);
  const balances = useSelector(state => state.expenses.balances);

  const dispatch = useDispatch();

  const dataLoaded =
    user &&
    debtsStatus === 'succeeded' &&
    friends.status === 'succeeded' &&
    expensesStatus === 'succeeded' &&
    groups.status === 'succeeded';

  useEffect(() => {
    if (dataLoaded) {
      dispatch(setBalances(balanceCalc(debts, user?.id)));
    }
  }, [dataLoaded, debts, user.id, dispatch]);

  useEffect(() => {
    if(expensesStatus === 'idle') {
      dispatch(fetchExpenses());
    }
  }, [expensesStatus, dispatch]);

  useEffect(() => {
    if(friends.status === 'idle') {
      dispatch(fetchFriends(user.id));
    }
  }, [friends, dispatch]);

  useEffect(() => {
    if(debtsStatus === 'idle') {
      dispatch(fetchDebts());
    }
  }, [debtsStatus, dispatch]);

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
