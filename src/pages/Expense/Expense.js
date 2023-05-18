import './Expense.scss';
import { useEffect, useState, useMemo } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import Header from '../../components/Header/Header';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import Modal from '../../components/Modal/Modal';
import PayUp from '../../components/PayUp/PayUp';
import Amount from '../../components/Amount/Amount';
import Activity from '../../components/Activity/Activity';
import deleteImg from '../../images/Delete.svg';
import { useGetExpenseQuery, useRemoveExpenseMutation } from '../../slices/expenseSlice';
import { useGetExpenseDebtsQuery } from '../../slices/debtSlice';
import { useGetAccountQuery } from '../../slices/accountSlice';
import { useAddActivityMutation, useGetActivityByReferenceIdsQuery } from '../../slices/activityApi';
import { formatExpenseDate } from '../../helpers/date';
import successImg from '../../images/Success.svg';


const UserDebtor = ({ debt }) => {
  const user = useSelector(state => state.auth.user);
  const {
    data: debtor
  } = useGetAccountQuery(debt?.debtor_id);
  
  return (
    <div className="user-transaction">
      <div className="user-details">
        <div className="user__avatar">
          <Avatar
            classes={debt?.paid ? 'success-border' : 'white-border'}
            url={debtor?.avatar_url}
            size={50}
          />
          {debt?.paid ? <img className="user__avatar--success" src={successImg} alt="success" /> : null}
        </div>
        <span>{debtor?.id !== user?.id ? debtor?.name : 'You'}</span>
      </div>
      <Amount amount={debt?.amount} type={debt?.paid ? 'OWED' : 'OWE'} />
    </div>
  )
}

const Expense = () => {
  let { id } = useParams();
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();
  const [openPayUp, setOpenPayUp] = useState(false);
  const [referenceIds, setReferenceIds] = useState([]);

  const {
    data: expense,
    isSuccess: expenseFetchSuccess
  } = useGetExpenseQuery(id, {
    skip: !id
  });

  const { 
    data: debts,
    isSuccess: debtsFetchSuccess
  } = useGetExpenseDebtsQuery(id, {
    skip: !id
  });

  useEffect(() => {
    if (!debtsFetchSuccess || !expenseFetchSuccess) return;
    setReferenceIds(debts?.map(debt => debt?.id));
    setReferenceIds(previousState => [...previousState, expense?.id]);
  }, [debtsFetchSuccess, expenseFetchSuccess, debts, expense]);

  const sortActivities = useMemo(() => {
    return createSelector(
      res => res.data,
      (data) => data?.slice(-10).sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        }) ?? []
      )
  }, []);

  const {
    data: activities,
    isSuccess: activitiesFetchSuccess
  } = useGetActivityByReferenceIdsQuery(referenceIds, {
    skip: !debtsFetchSuccess || !expenseFetchSuccess || referenceIds.length === 0,
    selectFromResult: (result) => ({
      data: sortActivities(result),
      isSuccess: result.isSuccess
    })
  });

  const [removeExpense] = useRemoveExpenseMutation();
  const [addActivity] = useAddActivityMutation();

  const currentUserPayer = user?.id === expense?.payer_id;
  const currentUserDebts = !currentUserPayer ?
    debts?.filter(debt => debt.debtor_id === user?.id) : [];
  const userDebtsPaid = !currentUserPayer ? currentUserDebts?.filter(debt => debt.paid) : [];
  
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
              subTitle={`Added ${formatExpenseDate(expense?.created_at)}`}
              type="expense"
              actions={expense?.paid || userDebtsPaid?.length ? null : payButton}
            />
            <div className="expense-transactions-container">
              <div className="details-paid">
                <h2>Paid by</h2>
                <div className="paid-by">
                  <div className="user-transaction">
                    <div className="user-details">
                      <Avatar
                        classes="white-border"
                        url={userCreditor?.avatar_url}
                        size={50}
                      />
                      <span>{userCreditor?.id !== user?.id ? userCreditor?.name : 'You'}</span>
                    </div>
                    <Amount amount={expense?.amount} />
                  </div>
                </div>
              </div>
              <div className="details-owed">
                <h2>Split with</h2>
                <div className="split-with">
                  {debtsFetchSuccess ? debts?.map(debt => (
                    <UserDebtor key={debt?.id} debt={debt} />
                  )) : null}
                </div>
              </div>
              {activitiesFetchSuccess && activities.length > 0 ? (
                <div className="expense-activities-container">
                  <h2>Activities</h2>
                  <div className="expense-activities">
                    {activities?.map(activity => (
                      <Activity key={activity?.id}
                        userId={activity?.user_id}
                        referenceId={activity?.reference_id}
                        type={activity?.type}
                        action={activity?.action}
                        date={activity?.created_at}
                        relatedUserId={activity?.related_user_id} />
                    ))}
                  </div>
                </div>) : null}
            </div>
          </div>
          <Modal open={openPayUp}>
            <PayUp
              setOpenPayUp={setOpenPayUp}
              allDebts={debts}
              expenses={[expense]}
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
