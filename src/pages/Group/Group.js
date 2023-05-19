import './Group.scss';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import { useGetGroupExpensesQuery, useGetGroupQuery } from '../../slices/groupSlice';
import { selectUserDebtsByGroupId, useGetDebtsQuery } from '../../slices/debtSlice';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import Balances from '../../components/Balances/Balances';
import Skeleton from '../../components/Skeleton/Skeleton';
import ExpenseTransaction from '../../components/Transactions/ExpenseTransaction/ExpenseTransaction';

const Group = () => {
  const { id } = useParams();
  const user = useSelector(state => state.auth.user);

  const {
    data: group,
    isSuccess: groupFetched
   } = useGetGroupQuery(id);

  const {
    data: groupExpenses,
    isLoading: groupExpensesLoading,
    isSuccess: groupExpensesFetched
  } = useGetGroupExpensesQuery(id, {
    skip: !id
  });

  const {
    userGroupDebts,
    isLoading: debtsLoading,
    isSuccess: debtsFetched } = useGetDebtsQuery(user?.id, {
    selectFromResult: (result) => ({
      ...result,
      userGroupDebts: selectUserDebtsByGroupId(result, id)
    })
  });

  const unpaidGroupExpenses = groupExpenses?.filter(expense => !expense?.paid);

  return (
    groupFetched && (
      <>
      <Header type="title" classes={`group--${group?.color}`} />
      <div className="group-container">
        <DetailsCard 
          title={group.group_name}
          avatarUrl={group?.avatar_url}
          classes={`group--${group?.color}`}
          type="group" />
        <div className="group__section group__section--balance">
          <h2>Balance</h2>
          <Balances debts={userGroupDebts} debtsStatus={{
            loading: debtsLoading,
            fetched: debtsFetched
          }} />
        </div>
        <div className="group__section group__section--transactions">
          <h2>Group expenses</h2>
          <div className="group__transactions">
            {!groupExpensesFetched || groupExpensesLoading ? (
              <Skeleton width="100%" height="56px" />
            ) : (
              groupExpenses.length > 0 && unpaidGroupExpenses.map(expense => {
                return (
                  <ExpenseTransaction
                    key={expense.id}
                    transaction={expense}
                    />
                );
              })
            )}
            {groupExpensesFetched && unpaidGroupExpenses.length === 0 && (
              <div className="medium-gray">No group expenses available</div>
            )}
          </div>
        </div>
      </div>
      </>
    )
  );
};

export default Group;
