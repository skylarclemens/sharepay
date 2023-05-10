import './Group.scss';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { groupBalanceCalc } from '../../helpers/balance';
import { formatMoney } from '../../helpers/money';
import Header from '../../components/Header/Header';
import { useGetGroupExpensesQuery, useGetGroupQuery } from '../../slices/groupSlice';
import Avatar from '../../components/Avatar/Avatar';

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
        <div className={`page-info-container ${`group--${group?.color}`}`}>
          <Avatar
            classes="white-border"
            url={group?.avatar_url}
            size={65}
            type="group"
          />
          <div className="page-info">
            <h1 className="page-title">{group?.group_name}</h1>
          </div>
          <div className="balance-block">
            <h3 className="balance-text">GROUP BALANCE</h3>
            <span className="total-amount">
              {groupExpensesFetched && formatMoney(groupBalanceCalc(groupExpenses), false)}
            </span>
          </div>
        </div>
        <h2 className="heading">Group expenses</h2>
        <div className="shared-expenses">
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
      </>
    )
  );
};

export default Group;
