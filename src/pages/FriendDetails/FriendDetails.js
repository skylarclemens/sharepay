import { useSelector } from 'react-redux';
import './FriendDetails.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import Avatar from '../../components/Avatar/Avatar';
import Transactions from '../../components/Transactions/Transactions';
import Header from '../../components/Header/Header';
import PayUp from '../../components/PayUp/PayUp';
import { balanceCalc } from '../../helpers/balance';

const FriendDetails = () => {
  const user = useSelector(state => state.user);
  const friends = useSelector(state => state.friends.data);
  const [sharedDebts, setSharedDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState({total: 0, owed: 0, owe: 0});
  const [openPayUp, setOpenPayUp] = useState(false);
  let { id } = useParams();

  const friend = friends.find(friend => friend.id === id);

  useEffect(() => {
    const getSharedDebts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('debt')
          .select()
          .or(`creditor_id.eq.${friend.id},debtor_id.eq.${friend.id}`)
          .neq('paid', true);
        if (error) throw error;
        setSharedDebts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getSharedDebts();
  }, [friend]);

  useEffect(() => {
    setBalances(balanceCalc(sharedDebts, user.id));
  }, [sharedDebts, user]);

  const handleOpenPayUp = () => {
    setOpenPayUp(true);
  }

  return (
    <div className={`friend-pay-container ${openPayUp ? 'modal-open' : ''}`}>
      <div className={openPayUp ? 'modal-overlay' : ''}></div>
      <Header type="title" title="Friend details" />
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
            <div className="balance balance-block balance-block--total">
              <h3>BALANCE</h3>
              <span className={`total ${balances.total < 0 ? 'total--owe' : ''}`}>${balances.total.toFixed(2) || 0.00}</span>
            </div>
          </div>
          <div className="pay-up-button">
            {/* <Link className="button" to={`/pay-up/${friend.id}`}>Pay up</Link> */}
            <button type="button" className="button" title="Pay up" onClick={handleOpenPayUp}>Pay up</button>
          </div>
          <div className="shared-expenses">
            <h2 className="heading">Shared expenses</h2>
            {loading ? (
                <span className="loading-data medium-gray">Loading...</span>
            ) : (
              <Transactions debts={sharedDebts} friend={friend} />
            )}
          </div>
        </div>
      }
      <PayUp setOpenPayUp={setOpenPayUp} openPayUp={openPayUp} friend={friend} sharedDebts={sharedDebts} balances={balances} />
    </div>
  )
}

export default FriendDetails;