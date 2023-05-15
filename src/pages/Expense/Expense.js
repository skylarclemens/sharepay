import './Expense.scss';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import Header from '../../components/Header/Header';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import deleteImg from '../../images/Delete.svg';
import { useGetExpenseQuery, useRemoveExpenseMutation } from '../../slices/expenseSlice';
import { useGetDebtsQuery, selectDebtsByExpenseId } from '../../slices/debtSlice';
import { useGetAccountQuery } from '../../slices/accountSlice';
import { formatExpenseDate } from '../../helpers/date';

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
    isSuccess: expenseFetchSuccess
  } = useGetExpenseQuery(id);

  const { debts,
    isSuccess: debtsFetchSuccess } = useGetDebtsQuery(undefined, {
    selectFromResult: result => ({
      ...result,
      debts: selectDebtsByExpenseId(result, expense?.id)
    })
  });
  const [removeExpense] = useRemoveExpenseMutation();
  
  const {
    data: userCreditor,
    isSuccess: creditorFetchSuccess
  } = useGetAccountQuery(expense?.payer_id,
    {
      skip: !expenseFetchSuccess
    });

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
        headerRight={headerImg}
        headerRightFn={handleDelete}
      />
      {(auth.session && expenseFetchSuccess && creditorFetchSuccess) && (
        <div className="expense-details-container">
          <DetailsCard 
            title={expense?.description}
            subTitle={`Created on ${formatExpenseDate(expense?.created_at)}`}
            type="expense"
          />
          <div className="expense-transactions-container">
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
              {debtsFetchSuccess && debts.map(debt => (
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
