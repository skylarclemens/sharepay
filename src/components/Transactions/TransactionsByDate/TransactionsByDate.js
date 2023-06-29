import { useEffect, useState } from 'react';
import './TransactionsByDate.scss';
import SimpleTransaction from '../SimpleTransaction/SimpleTransaction';
import { formatMoney } from '../../../helpers/money';
import { useSelector } from 'react-redux';

const TransactionsByDate = ({ transactions, type = 'debt', showYear = true }) => {
  const user = useSelector(state => state.auth.user);
  const [sortedTransactions, setSortedTransactions] = useState(transactions);
  const [transactionsByYearAndMonth, setTransactionsByYearAndMonth] = useState([]);

  useEffect(() => {
    const transactionsCopy = [...transactions];
    transactionsCopy?.sort((a, b) => {
      const aDate = a?.expense?.date || a?.created_at;
      const bDate = b?.expense?.date || b?.created_at;
      return new Date(bDate) - new Date(aDate)
    })
    setSortedTransactions(transactionsCopy);
  }, [transactions])

  useEffect(() => {
    const byYearAndMonth = getTransactionsByYearAndMonth(sortedTransactions);
    setTransactionsByYearAndMonth(byYearAndMonth);
  }, [sortedTransactions])

  const getTransactionsByYearAndMonth = (transactions) => {
    const byYearAndMonth = {};
    transactions?.forEach(transaction => {
      const date = new Date(transaction?.expense?.date || transaction?.created_at);
      const year = date.getFullYear();
      const month = date.getMonth();
      if(!byYearAndMonth[year]) {
        byYearAndMonth[year] = {};
      }
      if (!byYearAndMonth[year][month]) {
        byYearAndMonth[year][month] = [];
      }
      byYearAndMonth[year][month].push(transaction);
    })
    return byYearAndMonth;
  }

  return (
    <>
      {Object.keys(transactionsByYearAndMonth)?.map(year => {
        return (
          <div key={year} className="transactions-by-year">
            {Object.keys(transactionsByYearAndMonth[year])?.reverse().map((month, index) => {
              return (
                <div key={month} className="transactions-by-month">
                  <div className={`transactions-by-month__name ${index === 0 ? 'transactions-by-month--first' : ''}`}>
                    {new Date(year, month).toLocaleString('default', { month: 'long' })}
                    {index === 0 && (
                      <div className={`transactions-by-year__year ${!showYear && 'hide-year'}`}>{year}</div>
                    )}
                  </div>
                  <div className="transactions-by-month__transactions transactions">
                    {transactionsByYearAndMonth[year][month]?.map(transaction => {
                      if(type === 'debt') {
                        return (
                          <SimpleTransaction key={transaction?.id}
                            to={`/expense/${transaction?.expense?.id}`}
                            description={transaction?.expense?.description}
                            date={transaction?.expense?.date || transaction?.created_at}
                            amount={`${transaction?.creditor_id === user?.id ? '+' : '-'}${formatMoney(transaction?.amount, false)}`}
                            category={transaction?.expense?.category}
                            transactionType={transaction?.creditor_id === user?.id ? 'owed' : 'owe'} />
                        )
                      }
                      return null;
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}

export default TransactionsByDate;