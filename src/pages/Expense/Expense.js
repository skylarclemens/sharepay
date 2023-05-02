import './Expense.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import Header from '../../components/Header/Header';
import deleteImg from '../../images/Delete.svg';
import { selectFriendById } from '../../slices/friendSlice';
import { removeExpense, useGetExpenseQuery } from '../../slices/expenseSlice';
import { useGetDebtsQuery, selectDebtsByExpenseId } from '../../slices/debtSlice';

const Expense = () => {
  const account = useSelector(state => state.account.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { id } = useParams();
  const {
    data: expense,
    isSuccess
  } = useGetExpenseQuery(id);

  let userCreditor = useSelector(state => selectFriendById(state, expense.payer_id));

  if (expense.payer_id === account.id) {
    userCreditor = account;
  }

  const { debts } = useGetDebtsQuery(undefined, {
    selectFromResult: result => ({
      ...result,
      debts: selectDebtsByExpenseId(result, expense.id)
    })
  })

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('expense').delete().eq('id', id);
      if (error) throw error;
      dispatch(removeExpense(id));
    } catch (error) {
      console.error(error);
    } finally {
      navigate(-1);
    }
  };

  const headerImg = <img src={deleteImg} alt="Delete button" />;

  const UserDebtor = ({ debt }) => {
    let debtor = useSelector(state => selectFriendById(state, debt.debtor_id));
    if (debt.debtor_id === account.id) {
      debtor = account;
    }
    return (
      <div className="debtor-transaction">
        <div className="user-details">
          <Avatar
            classes="white-border"
            url={debtor.avatar_url}
            size={40}
          />
          <span>{debtor.name}</span>
        </div>
        <div className="expense-type">OWES</div>
        <div className="expense-amount expense-amount--owe">
          ${debt.amount.toFixed(2)}
        </div>
      </div>
    )
  }

  return (
    <>
      <Header
              type="title"
              title="Expense details"
              headerRight={headerImg}
              headerRightFn={handleDelete}
            />
      {isSuccess && (
        <div className="expense-container">
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
              {debts.map(debt => (
                <UserDebtor key={debt.debtor_id} debt={debt} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Expense;
