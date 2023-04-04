import './Expense.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../supabaseClient';
import { removeExpense } from '../../slices/expenseSlice';
import { removeDebtByExpense } from '../../slices/debtSlice';
import Avatar from '../../components/Avatar/Avatar';
import Header from '../../components/Header/Header';

const Expense = () => {
  const expenses = useSelector(state => state.expenses);
  const debts = useSelector(state => state.debts);
  const friends = useSelector(state => state.friends);
  const user = useSelector(state => state.user);
  const account = useSelector(state => state.account.data);
  const dispatch = useDispatch();
  let { id } = useParams();
  const expense = expenses.data.find(expense => expense.id === id);
  const debt = debts.data.find(debt => debt.expense_id === id);
  let debtType;
  let friendId;
  if (debt.creditor_id === user.id) {
    debtType = 'OWED';
    friendId = debt.debtor_id;
  } else {
    debtType = 'OWE';
    friendId = debt.creditor_id;
  }
  const friend = friends.data.find(friend => friend.id === friendId);

  const handleDelete = () => {
    try {
      const { error } = supabase
        .from('expense')
        .delete()
        .eq('id', id);
      if (error) throw error;
      dispatch(removeExpense(id));
      dispatch(removeDebtByExpense(id));
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="expense-container">
      <Header type="title" title="Details" />
      <div className="expense-page-container">
        <h1>{expense && expense.description}</h1>
        <div className="friend-transaction">
          <div className="expense-type">{debtType}</div>
          <div className="user-avatars">
            <Avatar url={friend.avatar_url}/>
            <span>{friend.name}</span>
          </div>
          <div className={`expense-amount ${debtType === 'OWE' ? 'expense-amount--owe' : ''}`}>${debt.amount.toFixed(2)}</div>
        </div>
        <button className="button button--red-gradient" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  )
}

export default Expense;