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

const PayUp = ({ setOpenPayUp, expenses, allDebts = [], sharedDebts, recipient }) => {
  const user = useSelector(state => state.auth.user);
  const {
    data: account
  } = useGetAccountQuery(user?.id);
  const [balances, setBalances] = useState({ total: 0, owed: 0, owe: 0 });
  const [debts, setDebts] = useState(allDebts);
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
    if (unpaidDebts.length === 0) {
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

    return closePayUp();
  }

  const closePayUp = () => {
    setOpenPayUp(false);
  }

  return (
    <div className="pay-up-container">
      <div className="expense-avatars">
        <Avatar url={account?.avatar_url} size={65} />
        <Avatar url={recipient?.avatar_url} size={65} />
      </div>
      <div className="balance-block balance-block--total">
        <div>
          Pay <span className="friend-name">{recipient?.name}</span>
        </div>
        <span className="total">
          ${Math.abs(balances?.total).toFixed(2) || 0.0}
        </span>
      </div>
      <button
        type="button"
        className="button"
        title="Pay up"
        onClick={handlePayButton}
      >
        Paid up
      </button>
      <button
        type="button"
        className="button button--white button--small"
        title="Cancel"
        onClick={closePayUp}
      >
        Cancel
      </button>
    </div>
  );
};

export default PayUp;
