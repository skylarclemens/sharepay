import SimpleTransaction from '../../../components/Transactions/SimpleTransaction/SimpleTransaction';
import { formatMoney } from '../../../helpers/money';

const Owe = ({ debts, user, ...props }) => {
  const unpaidUserDebts = debts?.filter(debt => !debt?.paid && debt?.debtor_id === user?.id);
  if(unpaidUserDebts?.length > 0) {
    return (
      unpaidUserDebts?.splice(0,5)?.map(debt => {
        return (
          <SimpleTransaction
            key={debt?.id}
            to={`/expense/${debt?.expense?.id}`}
            description={debt?.expense?.description}
            date={debt?.expense?.date}
            amount={formatMoney(debt?.amount, false)}
            category={debt?.expense?.category}
            transactionType={'owe'}
            {...props}
          />
        )})
    )
  } else {
    return <div className="no-transactions">You currently owe no money</div>;
  }
}

export default Owe;