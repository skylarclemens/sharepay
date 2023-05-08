import { useSelector } from 'react-redux';
import { useGetAccountsQuery } from '../../../slices/accountSlice';
import Transaction from '../../Transaction/Transaction';
import { useGetExpenseQuery } from '../../../slices/expenseSlice';

const DebtTransaction = ({ transaction }) => {
  const user = useSelector(state => state.auth.user);
  const transactionType = (transaction?.creditor_id === user?.id) ? 'OWED' : 'OWE';

  const {
    data: transactionUsers,
    isSuccess: accountsFetched
  } = useGetAccountsQuery([transaction?.creditor_id, transaction?.debtor_id]);
  const {
    data: expense,
    isSuccess: expenseFetched
  } = useGetExpenseQuery(transaction?.expense_id);

  return (
    (accountsFetched && expenseFetched) && 
      <Transaction
        link={`/expense/${transaction?.expense_id}`}
        color={transactionType === 'OWED' ? 'green' : 'red'}
        avatarUrls={[
          transactionUsers[0]?.avatar_url,
          transactionUsers[1]?.avatar_url
        ]}
        text={expense?.description}
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
  );
};

export default DebtTransaction;
