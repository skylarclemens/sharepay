import { useEffect, useState } from 'react';
import './TransactionsByDate.scss';
import DebtTransaction from '../DebtTransaction/DebtTransaction';

const TransactionsByDate = ({ transactions, type = 'debt', showYear = true }) => {
  const [sortedTransactions, setSortedTransactions] = useState(transactions);
  const [transactionsByYearAndMonth, setTransactionsByYearAndMonth] = useState([]);

  useEffect(() => {
    const transactionsCopy = [...transactions];
    transactionsCopy?.sort((a, b) => {
      return new Date(b?.created_at) - new Date(a?.created_at)
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
      const date = new Date(transaction?.created_at);
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
                          <DebtTransaction key={transaction?.id} transaction={transaction} />
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