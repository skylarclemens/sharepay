import './PayUp.scss';
import Avatar from '../Avatar/Avatar';
import { balanceCalc } from '../../helpers/balance';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useUpdateExpensesMutation } from '../../slices/expenseSlice';
import { useGetDebtsByExpenseIdsQuery, useUpdateDebtsMutation } from '../../slices/debtSlice';
import { useGetAccountQuery } from '../../slices/accountSlice';
import { useAddPaymentsMutation } from '../../slices/paymentApi';
import { useAddActivityMutation } from '../../slices/activityApi';
import successPayImg from '../../images/Success-pay.svg';

const PayUp = ({ setOpenPayUp, expenses, allDebts = [], sharedDebts, recipient }) => {
  const user = useSelector(state => state.auth.user);
  const {
    data: account
  } = useGetAccountQuery(user?.id);
  const [balances, setBalances] = useState({ total: 0, owed: 0, owe: 0 });
  const [debts, setDebts] = useState(allDebts);
  const [showSuccess, setShowSuccess] = useState(false);
  const [updateDebts] = useUpdateDebtsMutation();
  const [updateExpenses] = useUpdateExpensesMutation();
  const [addPayments] = useAddPaymentsMutation();
  const [addActivity] = useAddActivityMutation();

  useEffect(() => {
    setBalances(balanceCalc(sharedDebts, user?.id));
  }, [sharedDebts, user]);

  const {
    data: expenseDebts,
    isSuccess: expenseDebtsFetched,
  } = useGetDebtsByExpenseIdsQuery(expenses?.filter(expense => expense.paid === false).map(expense => expense.id), {
    skip: allDebts.length > 0,
  });

  useEffect(() => {
    if(debts.length === 0 && expenseDebtsFetched) {
      setDebts(expenseDebts);
    }
  }, [debts, expenseDebts, expenseDebtsFetched]);

  const markExpensePaid = (expense, debts) => {
    const unpaidDebts = debts?.filter(
      debt => (debt.expense_id === expense.id) && !debt.paid
    ) ?? [];
    if (unpaidDebts?.length === 0) {
      return {
        ...expense,
        paid: true,
      };
    } else {
      return null;
    }
  };

  const handlePayButton = async () => {
    const updatedDebts = sharedDebts?.map(debt => {
      return {
        ...debt,
        paid: true,
      };
    });

    const updatedAllDebts = debts?.map(debt => {
      if(updatedDebts.find(shared => (shared.id === debt.id) && shared.paid)) {
        return {
          ...debt,
          paid: true,
        };
      } else {
        return debt;
      }
    });

    const updatedExpenses = expenses?.map(expense => {
      return markExpensePaid(expense, updatedAllDebts);
    }).filter(expense => expense !== null) ?? [];

    try {
      await updateDebts(updatedDebts).unwrap();
    } catch (error) {
      console.error(error);
    }

    try {
      if(updatedExpenses?.length > 0) {
        await updateExpenses(updatedExpenses).unwrap();
      }
    } catch (error) {
      console.error(error);
    }

    const newPayments = updatedDebts?.map(debt => {
      return {
        payer_id: debt.debtor_id,
        recipient_id: debt.creditor_id,
        amount: Math.abs(balances?.total).toFixed(2),
        debt_id: debt.id,
        group_id: debt?.group_id ?? null,
      }
    });

    try {
      await addPayments(newPayments).unwrap();
    } catch (error) {
      console.error(error);
    }

    const newDebtActivities = updatedDebts?.map(debt => {
      const newActivity = {
        reference_id: debt.id,
        type: 'DEBT',
      }
      if (debt.debtor_id !== user?.id) {
        return {
          user_id: debt.creditor_id,
          related_user_id: debt.debtor_id,
          action: 'SETTLE',
          ...newActivity
        }
      }
      return {
        user_id: debt.debtor_id,
        related_user_id: debt.creditor_id,
        action: 'PAY',
        ...newActivity
      }
    });

    const newExpenseActivities = updatedExpenses?.map(expense => {
      return {
        user_id: user?.id,
        reference_id: expense.id,
        type: 'EXPENSE',
        action: 'PAY',
      }
    }) ?? [];

    try {
      await addActivity(newDebtActivities).unwrap();
    } catch (error) {
      console.error(error);
    }

    try {
      if(newExpenseActivities?.length > 0) {
        await addActivity(newExpenseActivities).unwrap();
      }
    } catch (error) {
      console.error(error);
    }

    return setShowSuccess(true);
  }

  const closePayUp = () => {
    setOpenPayUp(false);
  }

  return (
    <div className="pay-up-container">
      {!showSuccess ? (
        <>
          <div className="pay-up-text">
            <div className="pay-avatars">
              <Avatar url={balances < 0 ? account?.avatar_url : recipient?.avatar_url} size={70} classes="white-border" />
              <Avatar url={balances < 0 ? recipient?.avatar_url : account?.avatar_url} size={70} classes="white-border" />
            </div>
            <div className="balance-block balance-block--total">
              <div div className="pay-text">
                <span className="user-name">{balances < 0 ? 'You' : recipient?.name}</span> paid <span className="user-name">{balances < 0 ? recipient?.name : 'you'}</span>
              </div>
              <span className="total">
                ${Math.abs(balances?.total).toFixed(2) || 0.0}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="button button--flat button--medium"
            title="Pay up"
            onClick={handlePayButton}
          >
            Confirm
          </button>
          <button
            type="button"
            className="button button--gray button--medium"
            title="Cancel"
            onClick={closePayUp}
          >
            Cancel
          </button>
        </>) : (
        <>
          <div className="pay-up-text">
          <img src={successPayImg} alt="Success" className="success-img" />

            <div className="pay-text">You're all paid up!</div>
          </div>
          <button
            type="button"
            className="button button--flat button--medium"
            title="Close"
            onClick={closePayUp}
          >
            Close
          </button>
        </>
      )}
    </div>
  );
};

export default PayUp;
