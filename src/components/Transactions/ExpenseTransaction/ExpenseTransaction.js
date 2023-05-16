import './ExpenseTransaction.scss';
import { useSelector } from 'react-redux';
import { useGetAccountQuery, useGetAccountsQuery } from '../../../slices/accountSlice';
import { selectDebtsByExpenseId, useGetDebtsQuery } from '../../../slices/debtSlice';
import Transaction from '../../Transaction/Transaction';

const ExpenseTransaction = ({ transaction, classes='' }) => {
  const user = useSelector(state => state.auth.user);

  const { debts,
    isSuccess: debtorsFetched } = useGetDebtsQuery(user?.id, {
    selectFromResult: (result) => ({
      ...result,
      debts: selectDebtsByExpenseId(result, transaction?.id)
    })
  });

  const debtors = debts?.map(debt => debt?.debtor_id);
  const userDebt = debts?.filter(debt => debt?.debtor_id === user?.id || debt?.creditor_id === user?.id)[0];

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
        classes={classes}
        transactionRight={(
          <div className="transaction-amount">
            <div
              className={`expense-amount ${
                transactionType === 'OWE' ? 'expense-amount--owe' : ''
              }`}
            >
              ${userDebt?.amount.toFixed(2)}
            </div>
          </div>
        )}
      />
    )
  );
};

export default ExpenseTransaction;
