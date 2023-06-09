import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUserExpensesByGroup } from '../../../slices/expenseSlice';
import ExpenseTransaction from '../../../components/Transactions/ExpenseTransaction/ExpenseTransaction';
import './GroupExpenses.scss';

const GroupExpenses = ({ group }) => {
  const allGroupExpenses = useSelector(state => selectUserExpensesByGroup(state, group.id));
  const expensesList = allGroupExpenses.filter(expense => !expense?.paid);
  const displayExpenses = expensesList.slice(0,4);

  return (
    expensesList.length > 0 && (
    <div className="group-expenses">
      <Link to={`/group/${group?.id}`} className="group-expenses__link">
        <div className="group-name">
          {group?.group_name}
          <div className="arrow arrow--right"></div>
        </div>
      </Link>
      <div className="expenses-list">
        {displayExpenses.map(expense => {
          return (
            <ExpenseTransaction key={expense.id}
              transaction={expense}
              classes="group-expense" />
          )
        })}
        {expensesList.length > 4 && (
          <Link to={`/group/${group?.id}`} className="more-expenses">
            <div className="more-expenses__text">See more</div>
            <div className="arrow arrow--right"></div>
          </Link>
        )}
      </div>
    </div>)
  )
}

export default GroupExpenses