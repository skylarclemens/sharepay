import './Expense.scss';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import Header from '../../components/Header/Header';
import deleteImg from '../../images/Delete.svg';
import { useGetExpenseQuery, useRemoveExpenseMutation } from '../../slices/expenseSlice';
import { useGetDebtsQuery, selectDebtsByExpenseId } from '../../slices/debtSlice';
import { useGetAccountQuery } from '../../slices/accountSlice';

const UserDebtor = ({ debt }) => {
  const {
    data: debtor
  } = useGetAccountQuery(debt?.debtor_id);
  
  return (
    <div className="debtor-transaction">
      <div className="user-details">
        <Avatar
          classes="white-border"
          url={debtor?.avatar_url}
          size={40}
        />
        <span>{debtor?.name}</span>
      </div>
      <div className="expense-type">OWES</div>
      <div className="expense-amount expense-amount--owe">
        ${debt?.amount.toFixed(2)}
      </div>
    </div>
  )
}

const Expense = () => {
  let { id } = useParams();
  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();

  const {
    data: expense,
    isSuccess
  } = useGetExpenseQuery(id);
  const { debts } = useGetDebtsQuery(undefined, {
    selectFromResult: result => ({
      ...result,
      debts: selectDebtsByExpenseId(result, expense?.id)
    })
  });
  const [removeExpense] = useRemoveExpenseMutation();
  
  const {
    data: userCreditor
  } = useGetAccountQuery(expense?.payer_id);

  const handleDelete = async () => {
    try {
      await removeExpense(id).unwrap();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const headerImg = <img src={deleteImg} alt="Garbage icon for delete button" />;

  return (
    <>
      <Header
              type="title"
              title="Expense details"
              headerRight={headerImg}
              headerRightFn={handleDelete}
            />
      {(auth.session && isSuccess) && (
        <div className="expense-container">
          <div className="expense-page-container">
            <div className="page-info-container">
              <div className="page-info">
                <h1 className="page-title">{expense?.description}</h1>
              </div>
              <span className="total-amount">${expense?.amount.toFixed(2)}</span>
              <span className="created-date">
                Created on{' '}
                {new Date(expense?.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {expense?.paid && <div className="paid-up">PAID UP</div>}
            </div>
            <div className="user-transaction">
              <div className="details-paid">
                <div className="user-details">
                  <Avatar
                    classes="white-border"
                    url={userCreditor?.avatar_url}
                    size={40}
                  />
                  <span>{userCreditor?.name}</span>
                </div>
                <span className="expense-type">PAID</span>
                <span className="expense-amount">
                  ${expense?.amount.toFixed(2)}
                </span>
              </div>
              {debts.map(debt => (
                <UserDebtor key={debt?.id} debt={debt} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Expense;
