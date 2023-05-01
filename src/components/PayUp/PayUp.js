import './PayUp.scss';
import Avatar from '../Avatar/Avatar';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../supabaseClient';
import { selectSharedExpensesByDebts, updateExpense } from '../../slices/expenseSlice';
import { selectAllDebts, updateDebt } from '../../slices/debtSlice';

const PayUp = ({ setOpenPayUp, openPayUp, friend, sharedDebts, balances }) => {
  const account = useSelector(state => state.account.data);
  const currentExpenses = useSelector(state => selectSharedExpensesByDebts(state, sharedDebts));
  const debts = useSelector(selectAllDebts);
  const [userDebtor, setUserDebtor] = useState(account);
  const [userCreditor, setUserCreditor] = useState(friend);
  const [payType, setPayType] = useState('OWE');
  const dispatch = useDispatch();

  useEffect(() => {
    if (balances.total > 0) {
      setPayType('OWED');
      setUserCreditor(account);
      setUserDebtor(friend);
    } else {
      setPayType('OWE');
      setUserCreditor(friend);
      setUserDebtor(account);
    }
  }, [balances, account, friend]);

  const markExpensePaid = (expense) => {
    const unpaidDebts = debts.filter(
      debt => debt.expense_id === expense.id && !debt.paid
    );
    if (unpaidDebts.length === 0) {
      return {
        ...expense,
        paid: true,
      };
    } else {
      return expense;
    }
  };

  const handlePayButton = async () => {
    const updatedDebts = sharedDebts.map(debt => {
      return {
        ...debt,
        paid: true,
      };
    });

    const updatedExpenses = currentExpenses.map(expense => {
      return markExpensePaid(expense, updatedDebts);
    });

    dispatch(updateDebt(updatedDebts));
    dispatch(updateExpense(updatedExpenses));

    const insertDebtPaid = async paidUpId => {
      const paidDebt = updatedDebts.map(debt => {
        return {
          debt_id: debt.id,
          paid_id: paidUpId,
        };
      });

      try {
        const { error } = await supabase.from('debt_paid').insert(paidDebt);
        if (error) throw error;
      } catch (error) {
        console.error(error);
      }
    };

    try {
      const { data, error } = await supabase
        .from('paid_up')
        .insert({
          creditor_id: userCreditor.id,
          debtor_id: userDebtor.id,
        })
        .select();
      insertDebtPaid(data[0].id);
      if (error) throw error;
    } catch (error) {
      console.error(error);
    }

    closePayUp();
  };

  const closePayUp = () => {
    setOpenPayUp(false);
  };

  return (
    openPayUp && (
      <div className="modal-container">
        <div className="pay-up-container">
          <div className="expense-avatars">
            <Avatar url={userDebtor?.avatar_url} size={65} />
            <Avatar url={userCreditor?.avatar_url} size={65} />
          </div>
          <div className="balance-block balance-block--total">
            <div>
              {payType === 'OWE' ? (
                <>
                  Pay <span className="friend-name">{friend.name}</span>
                </>
              ) : (
                <>
                  <span className="friend-name">{friend.name}</span> paid you
                </>
              )}
            </div>
            <span className="total">
              ${Math.abs(balances.total).toFixed(2) || 0.0}
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
      </div>
    )
  );
};

export default PayUp;
