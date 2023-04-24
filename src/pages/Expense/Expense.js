import './Expense.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../supabaseClient';
import { removeExpense } from '../../slices/expenseSlice';
import { removeDebtByExpense } from '../../slices/debtSlice';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import Header from '../../components/Header/Header';
import deleteImg from '../../images/Delete.svg';

const Expense = () => {
  const expenses = useSelector(state => state.expenses.data);
  const debts = useSelector(state => state.debts.data);
  const friends = useSelector(state => state.friends.data);
  const account = useSelector(state => state.account.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { id } = useParams();
  const expense = expenses.find(expense => expense.id === id);
  const debt = debts.find(debt => debt.expense_id === id);
  let debtType = 'OWES';
  let userCreditor;
  let userDebtor;

  if (debt?.creditor_id === account.id) {
    userCreditor = account;
    userDebtor = friends.find(friend => friend.id === debt?.debtor_id) || null;
  } else {
    userCreditor =
      friends.find(friend => friend.id === debt?.creditor_id) || null;
    userDebtor = account;
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('expense').delete().eq('id', id);
      if (error) throw error;
      dispatch(removeExpense(id));
      dispatch(removeDebtByExpense(id));
    } catch (error) {
      console.error(error);
    } finally {
      navigate(-1);
    }
  };

  const headerImg = <img src={deleteImg} alt="Delete button" />;

  return (
    <>
      {expense && (
        <div className="expense-container">
          <Header
            type="title"
            title="Expense details"
            headerRight={headerImg}
            headerFn={handleDelete}
          />
          <div className="expense-page-container">
            <div className="page-info-container">
              <div className="page-info">
                <h1 className="page-title">{expense?.description}</h1>
              </div>
              <span className="total-amount">${expense.amount.toFixed(2)}</span>
              <span className="created-date">
                Created on{' '}
                {new Date(expense.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {expense.paid && <div className="paid-up">PAID UP</div>}
            </div>
            <div className="user-transaction">
              <div className="details-paid">
                <div className="user-details">
                  <Avatar
                    classes="white-border"
                    url={userCreditor.avatar_url}
                    size={40}
                  />
                  <span>{userCreditor.name}</span>
                </div>
                <span className="expense-type">PAID</span>
                <span className="expense-amount">
                  ${expense.amount.toFixed(2)}
                </span>
              </div>
              <div className="debtor-transaction">
                <div className="user-details">
                  <Avatar
                    classes="white-border"
                    url={userDebtor.avatar_url}
                    size={40}
                  />
                  <span>{userDebtor.name}</span>
                </div>
                <div className="expense-type">{debtType}</div>
                <div className="expense-amount expense-amount--owe">
                  ${debt.amount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Expense;
