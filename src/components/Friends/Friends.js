import './Friends.scss';
import AddFriend from '../AddFriend/AddFriend';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '../../supabaseClient';

const Friends = () => {
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [numRequests, setNumRequests] = useState(0);
  const [requests, setRequests] = useState([]);
  const user = useSelector(state => state.user);

  useEffect(() => {
    const getRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('friend_request')
          .select(`
            status,
            user_receive (
              id,
              name,
              email
            )
          `)
          .eq('user_send', user.id);
        console.log(data);
        setRequests(data);
      } catch (error) {
        console.error(error);
      }
    }

    getRequests();
  }, [numRequests]);

  return (
    <div className="friends-container">
      <h2 className="heading">Requests</h2>
      <div className="requests-container">
        {requests.length > 0 ?
          (requests.map((req) => {
            return (
              <div key={req.user_receive.id} className="user">
                <div className="user-info">
                  <div className="user-name">{req.user_receive.name}</div>
                  <div className="user-email">{req.user_receive.email}</div>
                </div>
                {req.status === 'SENT' ?
                  <div className="pill">PENDING</div>
                  : null
                }
              </div>
            )
          })) : null}
      </div>
      <button type="button" className="button add-friends-button" onClick={() => setAddFriendOpen(true)}>Add friend</button>
      {addFriendOpen ?
        <AddFriend setAddFriendOpen={setAddFriendOpen} setNumRequests={setNumRequests} numRequests={numRequests} />
        : null
      }
    </div>
  )
}

export default Friends;