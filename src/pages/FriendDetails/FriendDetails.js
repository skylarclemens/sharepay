import { useSelector } from 'react-redux';
import './FriendDetails.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import Avatar from '../../components/Avatar/Avatar';
import Transactions from '../../components/Transactions/Transactions';

const FriendDetails = () => {
  const account = useSelector(state => state.account.data);
  const friends = useSelector(state => state.friends.data);
  const expenses = useSelector(state => state.expenses.data);
  const [sharedExpenses, setSharedExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
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

  return (
    <>
      {friend &&
        <div className="friend-container">
          <div className="friend-info">
            <Avatar url={friend?.avatar_url} size={60} />
            <div className="friend-info-text">
              <h1>{friend?.name}</h1>
              <span className="medium-gray">{friend?.email}</span>
            </div>
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