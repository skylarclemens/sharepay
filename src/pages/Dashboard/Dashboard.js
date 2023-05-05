import './Dashboard.scss';
import { useDispatch, useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';
import { useEffect } from 'react';
import { setBalances, useGetExpensesQuery } from '../../slices/expenseSlice';
import Transactions from '../../components/Transactions/Transactions';
import { formatMoney } from '../../helpers/money';
import { useGetDebtsQuery } from '../../slices/debtSlice';

const Dashboard = () => {
  const {
    data: debts,
    isSuccess
  } = useGetDebtsQuery();
  const {
    data: expenses,
    isSuccess: expensesFetched
  } = useGetExpensesQuery();
  const user = useSelector(state => state.auth.user);
  const balances = useSelector(state => state.expenses.balances);

  const dispatch = useDispatch();

  const dataLoaded =
    user &&
    isSuccess;

  useEffect(() => {
    if (dataLoaded) {
      dispatch(setBalances(balanceCalc(debts, user?.id)));
    }
  }, [dataLoaded, debts, user.id, dispatch]);

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
            {expensesFetched && <Transactions transactions={expenses} />}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Dashboard;
