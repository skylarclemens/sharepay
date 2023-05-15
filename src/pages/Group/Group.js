import './Group.scss';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { groupBalanceCalc } from '../../helpers/balance';
import { formatMoney } from '../../helpers/money';
import Header from '../../components/Header/Header';
import { useGetGroupExpensesQuery, useGetGroupQuery } from '../../slices/groupSlice';
import { selectUserDebtsByGroupId, useGetDebtsQuery } from '../../slices/debtSlice';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import Balances from '../../components/Balances/Balances';

const Group = () => {
  const { id } = useParams();

  const {
    data: group,
    isSuccess: groupFetched
   } = useGetGroupQuery(id);

  const {
    data: groupExpenses,
    isLoading: groupExpensesLoading,
    isSuccess: groupExpensesFetched
  } = useGetGroupExpensesQuery(id);

  const {
    userGroupDebts,
    isLoading: debtsLoading,
    isSuccess: debtsFetched } = useGetDebtsQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      userGroupDebts: selectUserDebtsByGroupId(result, id)
    })
  });

  const groupBalance = useMemo(() => {
    return groupBalanceCalc(groupExpenses);
  }, [groupExpenses])

  const formattedDate = expenseDate => {
    const date = new Date(expenseDate)
      .toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
      .split(' ');
    return (
      <>
        <div className="month">{date[0]}</div>
        <div className="day">{date[1]}</div>
      </>
    );
  };

  return (
    groupFetched && (
      <>
      <Header type="title" title="Group details" classes={`group--${group?.color}`} />
      <div className="group-container">
        <DetailsCard user={group} type="group" />
        <div className="group__section group__section--balance">
          <h2>Balance</h2>
          <Balances debts={userGroupDebts} debtsStatus={{
            loading: debtsLoading,
            fetched: debtsFetched
          }} />
        </div>
        <div className="group__section group__section--transactions">
          <h2>Group expenses</h2>
          <div className="group__transactions">
            {groupExpensesLoading ? (
              <div className="medium-gray">Loading...</div>
            ) : (
              groupExpensesFetched && groupExpenses.map(expense => {
                return (
                  <Link
                    to={`/expense/${expense.id}`}
                    key={expense.id}
                    className="expense-card"
                  >
                    <div className={`expense-date ${`group--${group?.color}`}`}>
                      {formattedDate(expense?.created_at)}
                    </div>
                    <div className="expense-description">
                      {expense?.description}
                    </div>
                    <div className="expense-amount">
                      {formatMoney(expense?.amount, false)}
                    </div>
                    <div className="arrow arrow--right"></div>
                  </Link>
                );
              })
            )}
            {groupExpensesFetched && groupBalance === 0 && (
              <div className="medium-gray">No group expenses available</div>
            )}
          </div>
        </div>
      </div>
      </>
    )
  );
};

export default Group;
