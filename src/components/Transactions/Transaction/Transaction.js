import './Transaction.scss';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar/Avatar';
import { useGetAccountQuery, useGetAccountsQuery } from '../../../slices/accountSlice';
import { useGetDebtsQuery } from '../../../slices/debtSlice';
import { useMemo } from 'react';
import { createSelector } from '@reduxjs/toolkit';

const Transaction = ({ transaction }) => {
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
      <Link
        className="expense-link"
        to={`/expense/${transaction?.id}`}
      >
        <div className={`transaction ${
            transactionType === 'OWE' ? 'transaction--owe' : ''
          }`}>
          <div className="expense-avatars">
            <Avatar url={userCreditor?.avatar_url} classes="white-border" size={40} />
            {userDebtors.map((userDebtor) => <Avatar key={userDebtor?.id} url={userDebtor?.avatar_url} classes="white-border" size={40} />)}
          </div>
          <div className="desc">{transaction?.description}</div>
          {transaction?.paid && <div className="debt-paid">PAID UP</div>}
          {!transaction?.paid && (
            <>
              <div className="transaction-amount">
                <div
                  className={`expense-amount ${
                    transactionType === 'OWE' ? 'expense-amount--owe' : ''
                  }`}
                >
                  ${transaction?.amount.toFixed(2)}
                </div>
              </div>
              <div className="arrow arrow--right"></div>
            </>
          )}
        </div>
      </Link>
    )
  );
};

export default Transaction;
