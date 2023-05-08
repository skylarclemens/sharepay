import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUserExpensesByGroup } from '../../../slices/expenseSlice';
import ExpenseTransaction from '../../../components/Transactions/ExpenseTransaction/ExpenseTransaction';
import './GroupExpenses.scss';

const GroupExpenses = ({ group }) => {
  const expensesList = useSelector(state => selectUserExpensesByGroup(state, group.id));

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
        {expensesList.map(expense => {
          return (
            <ExpenseTransaction key={expense.id}
              transaction={expense}
              classes="group-expense" />
          )
        })}
      </div>
    </div>)
  )
}

export default GroupExpenses