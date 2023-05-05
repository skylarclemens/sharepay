import './ExpenseTransaction.scss';
import { useSelector } from 'react-redux';
import { useGetAccountQuery, useGetAccountsQuery } from '../../../slices/accountSlice';
import { useGetDebtsQuery } from '../../../slices/debtSlice';
import { useMemo } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import Transaction from '../../Transaction/Transaction';

const ExpenseTransaction = ({ transaction }) => {
  const user = useSelector(state => state.auth.user);

  const selectDebtorsByExpenseId = useMemo(() => {
    return createSelector(
      res => res.data,
      (res, transactionId) => transactionId,
      (data, transactionId) => data?.reduce((filtered, debt) => {
        if (debt.expense_id === transactionId) {
          filtered.push(debt.debtor_id);
        }
        return filtered;
      }, []) ?? []
    )
  }, []);

  const { debtors,
    isSuccess: debtorsFetched } = useGetDebtsQuery(undefined, {
    selectFromResult: result => ({
      ...result,
      debtors: selectDebtorsByExpenseId(result, transaction?.id)
    })
  });

  const {
    data: userCreditor
  } = useGetAccountQuery(transaction?.payer_id);

  const {
    data: userDebtors,
    isSuccess: accountsFetched
  } = useGetAccountsQuery(debtors, {
    skip: !debtorsFetched
  });

  const transactionType = (transaction?.payer_id === user?.id) ? 'OWED' : 'OWE';

  return (
    accountsFetched && (
      <Transaction
        link={`/expense/${transaction?.id}`}
        color={transactionType === 'OWED' ? 'green' : 'red'}
        avatarUrls={[
          userCreditor?.avatar_url,
          ...userDebtors.map(userDebtor => userDebtor?.avatar_url)
        ]}
        text={transaction?.description}
        transactionRight={(
          <div className="transaction-amount">
            <div
              className={`expense-amount ${
                transactionType === 'OWE' ? 'expense-amount--owe' : ''
              }`}
            >
              ${transaction?.amount.toFixed(2)}
            </div>
          </div>
        )}
      />
    )
  );
};

export default ExpenseTransaction;
