import './DashboardTabs.scss';
import SimpleTransaction from '../../../components/Transactions/SimpleTransaction/SimpleTransaction';
import { formatMoney } from '../../../helpers/money';

const Owed = ({ debts, user, ...props }) => {
  const unpaidFriendDebts = debts?.filter(debt => !debt?.paid && debt?.creditor_id === user?.id);
  if(unpaidFriendDebts?.length > 0) {
    return (
      unpaidFriendDebts?.splice(0,5)?.map(debt => {
        return (
          <SimpleTransaction
            key={debt?.id}
            to={`/expense/${debt?.expense?.id}`}
            description={debt?.expense?.description}
            date={debt?.expense?.date}
            amount={formatMoney(debt?.amount, false)}
            category={debt?.expense?.category}
            transactionType={'owed'}
            {...props}
          />
        )})
    )
  } else {
    return <>None</>;
  }
}

export default Owed;