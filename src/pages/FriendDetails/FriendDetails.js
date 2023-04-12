import { useSelector } from 'react-redux';
import './FriendDetails.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import Avatar from '../../components/Avatar/Avatar';
import Transactions from '../../components/Transactions/Transactions';
import { balanceCalc } from '../../helpers/balance';

const FriendDetails = () => {
  const user = useSelector(state => state.user);
  const friends = useSelector(state => state.friends.data);
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState({total: 0, owed: 0, owe: 0});
  let { id } = useParams();

  const friend = friends.find(friend => friend.id === id);

  useEffect(() => {
    const getSharedExpenses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
        .from('debt')
        .select()
        .or(`creditor_id.eq.${friend.id},debtor_id.eq.${friend.id}`);
        if (error) throw error;
        setSharedExpenses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getSharedExpenses();
  }, [friend]);

  useEffect(() => {
    setBalances(balanceCalc(sharedExpenses, user.id));
  }, [sharedExpenses, user]);

  return (
    <>
      {friend &&
        <div className="friend-container">
          <div className="friend-info-container">
            <div className="friend-info">
              <Avatar url={friend?.avatar_url} size={60} />
              <div className="friend-info-text">
                <h1>{friend?.name}</h1>
                <span className="medium-gray">{friend?.email}</span>
              </div>
            </div>
            <div className="balance-block balance-block--total">
              <h3>TOTAL BALANCE</h3>
              <span className={balances.total < 0 ? 'total--owe' : ''}>${balances.total.toFixed(2) || 0.00}</span>
            </div>
          </div>
          <div className="pay-up-button">
            <button type="button" className="button" title="Pay up">Pay up</button>
          </div>
          <div className="shared-expenses">
            <h2 className="heading">Shared expenses</h2>
            {loading ? (
                <span className="loading-data medium-gray">Loading...</span>
            ) : (
              <Transactions debts={sharedExpenses} friend={friend} />
            )}
          </div>
        </div>
      }
    </>
  )
}

export default FriendDetails;