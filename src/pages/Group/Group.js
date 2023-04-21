import './Group.scss';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { groupBalanceCalc } from '../../helpers/balance';
import { formatMoney } from '../../helpers/money';
import Header from '../../components/Header/Header';

const Group = () => {
  const groups = useSelector(state => state.groups.data);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [groupBalance, setGroupBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const group = groups.find(group => group.id === id);

  useEffect(() => {
    const getGroupExpenses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('expense')
          .select()
          .eq('group_id', group.id);
        if (error) throw error;
        setGroupExpenses(data)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getGroupExpenses();
  }, [group]);

  useEffect(() => {
    setGroupBalance(groupBalanceCalc(groupExpenses));
  }, [groupExpenses]);

  const formattedDate = (expenseDate) => {
    const date = new Date(expenseDate).toLocaleDateString("en-US", {
      month: 'short', day: 'numeric'
    }).split(' ');
    return (
      <>
        <div className="month">{date[0]}</div>
        <div className="day">{date[1]}</div>
      </>
    )
  }

  return (
    <div className="group-container">
      <Header type="title" title="Group details" />
      {group &&
        <>
          <div className="page-info-container">
            <div className="page-info">
              <h1 className="page-title">{group?.group_name}</h1>
            </div>
            <div className="balance-block">
              <h3 className="balance-text">GROUP BALANCE</h3>
              <span className="total-amount">{formatMoney(groupBalance, false)}</span>
            </div>
          </div>
          <h2 className="heading">Group expenses</h2>
          <div className="shared-expenses">
            {loading ? (
                <div className="medium-gray">Loading...</div>
            ) : (
              groupExpenses.map(expense => {
                return (
                  <Link to={`/expense/${expense.id}`} key={expense.id} className="expense-card">
                    <div className="expense-date">
                      {formattedDate(expense?.created_at)}
                    </div>
                    <div className="expense-description">
                      {expense?.description}
                    </div>
                    <div className="expense-amount">
                      {formatMoney(expense?.amount, false)}
                    </div>
                    <div className="arrow arrow--right"></div>
                  </Link>
                )
              })
            )}
            {!loading && groupBalance === 0 &&
            <div className="medium-gray">No group expenses available</div>}
          </div>
        </>
      }
    </div>
  )
}

export default Group;