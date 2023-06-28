import SimpleTransaction from '../../../components/Transactions/SimpleTransaction/SimpleTransaction';
import { formatMoney } from '../../../helpers/money';

const All = ({ debts, user, ...props }) => {
  const allUnpaidDebts = debts?.filter(debt => !debt?.paid);
  if (allUnpaidDebts?.length > 0) {
    return (
      allUnpaidDebts?.splice(0,5)?.map(debt => {
        return (
          <SimpleTransaction
            key={debt?.id}
            to={`/expense/${debt?.expense?.id}`}
            description={debt?.expense?.description}
            date={debt?.expense?.date}
            amount={`${debt?.creditor_id === user?.id ? '+' : '-'}${formatMoney(debt?.amount, false)}`}
            category={debt?.expense?.category}
            transactionType={debt?.creditor_id === user?.id ? 'owed' : 'owe'}
            {...props}
          />
        )
      })
    )
  } else {
    return <div className="no-transactions">You currently have no active transactions</div>;
  }
}

export default All;