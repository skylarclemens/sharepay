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

const PayUp = ({ setOpenPayUp, expenses, allDebts = null, sharedDebts, recipient }) => {
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
  } = useGetDebtsByExpenseIdsQuery(expenses?.map(expense => expense.id), {
    skip: allDebts.length > 0,
  });

  useEffect(() => {
    if(!allDebts) {
      setDebts(expenseDebts);
    }
  }, [allDebts, expenseDebts]);

  const markExpensePaid = (expense) => {
    const unpaidDebts = debts?.filter(
      debt => debt.expense_id === expense.id && !debt.paid
    ) ?? [];
    if (unpaidDebts.length === 0) {
      return {
        ...expense,
        paid: true,
      };
    } else {
      return expense;
    }
  };

  expenseDebtsFetched && console.log(markExpensePaid(expenses[0]));

  const handlePayButton = async () => {
    const updatedDebts = sharedDebts?.map(debt => {
      return {
        ...debt,
        paid: true,
      };
    });

    const updatedExpenses = expenses?.map(expense => {
      return markExpensePaid(expense);
    });

    try {
      await updateDebts(updatedDebts).unwrap();
    } catch (error) {
      console.error(error);
    }

    try {
      await updateExpenses(updatedExpenses).unwrap();
    } catch (error) {
      console.error(error);
    }

    const newPayments = updatedDebts?.map(debt => {
      return {
        payer_id: debt.debtor_id,
        recipient_id: debt.creditor_id,
        amount: debt.amount,
        debt_id: debt.id,
        group_id: debt?.group_id ?? null,
      }
    });

    try {
      await addPayments(newPayments).unwrap();
    } catch (error) {
      console.error(error);
    }

    const newActivities = updatedDebts?.map(debt => {
      return {
        user_id: user?.id,
        reference_id: debt.id,
        type: 'DEBT',
        action: 'PAID',
      }
    });

    try {
      await addActivity(newActivities).unwrap();
      closePayUp();
    } catch (error) {
      console.error(error);
    }
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
