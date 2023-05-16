import './Expense.scss';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import Header from '../../components/Header/Header';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import Modal from '../../components/Modal/Modal';
import PayUp from '../../components/PayUp/PayUp';
import deleteImg from '../../images/Delete.svg';
import { useGetExpenseQuery, useRemoveExpenseMutation } from '../../slices/expenseSlice';
import { useGetExpenseDebtsQuery } from '../../slices/debtSlice';
import { useGetAccountQuery } from '../../slices/accountSlice';
import { useAddActivityMutation } from '../../slices/activityApi';
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
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const [openPayUp, setOpenPayUp] = useState(false);

  const {
    data: expense,
    isSuccess: expenseFetchSuccess
  } = useGetExpenseQuery(id);

  const { 
    data: debts,
    isSuccess: debtsFetchSuccess } = useGetExpenseDebtsQuery(id);

  const [removeExpense] = useRemoveExpenseMutation();
  const [addActivity] = useAddActivityMutation();

  const currentUserPayer = user?.id === expense?.payer_id;
  const currentUserDebts = !currentUserPayer ?
    debts?.filter(debt => debt.debtor_id === user?.id) : [];
  
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
    } catch (error) {
      console.error(error);
    }

    try {
      await addActivity({
        user_id: user?.id,
        reference_id: id,
        type: 'EXPENSE',
        action: 'DELETE'
      }).unwrap();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const headerImg = <img src={deleteImg} alt="Garbage icon for delete button" />;
  const payButton = !currentUserPayer ? (
    <button className="button button--flat button--medium" onClick={() => setOpenPayUp(true)}>
      Pay
    </button>
  ) : null;

  return (
    <>
      <Header
        type="title"
        headerRight={headerImg}
        headerRightFn={handleDelete}
      />
      {(expenseFetchSuccess && creditorFetchSuccess) && (
        <>
          <div className="expense-details-container">
            <DetailsCard 
              title={expense?.description}
              subTitle={`Created on ${formatExpenseDate(expense?.created_at)}`}
              type="expense"
              actions={payButton}
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
                {debtsFetchSuccess ? debts?.map(debt => (
                  <UserDebtor key={debt?.id} debt={debt} />
                )) : null}
              </div>
            </div>
          </div>
          <Modal open={openPayUp}>
            <PayUp
              setOpenPayUp={setOpenPayUp}
              allDebts={debts}
              sharedDebts={currentUserDebts}
              recipient={userCreditor}
            />
          </Modal>
        </>
      )}
    </>
  );
};

export default Expense;
