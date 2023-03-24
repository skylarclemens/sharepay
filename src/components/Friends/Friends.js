import './Friends.scss';
import AddFriend from '../AddFriend/AddFriend';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../supabaseClient';
import { initializeFriends } from '../../slices/friendSlice';

const Friends = () => {
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const friends = useSelector(state => state.friends);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setFriends();
    getRequests();
  }, []);

  const setFriends = async () => {
    try {
      const { data, error } = await supabase
        .from('user_friend')
        .select(`
          user_id_2 (
            id,
            name,
            email
          )
        `)
        .eq('user_id_1', user.id);
      if (error) throw error;
      dispatch(initializeFriends(data));
    } catch (error) {
      console.error(error);
    }
  }

  const getRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('friend_request')
        .select(`
          id,
          status,
          user_send (
            id,
            name,
            email
          ),
          user_receive (
            id,
            name,
            email
          )
        `)
        .or(`user_send.eq.${user.id},user_receive.eq.${user.id}`);
      if (error) throw error;
      setRequests(data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleRequestChoice = async (choice, request) => {
    if (choice === 'ACCEPTED') {
      try {
        const { error } = await supabase
          .from('friend_request')
          .delete()
          .eq('id', request.id);
        if(error) throw error;
        addFriend(request.user_send.id, request.user_receive.id);
        addFriend(request.user_receive.id, request.user_send.id);
      } catch (error) {
        console.error(error);
      }
    } else if (choice === 'IGNORED') {
      try {
        const { error } = await supabase
          .from('friend_request')
          .update({
            status: 'IGNORED',
            status_change: new Date().toISOString()
          })
          .eq('id', request.id);
        if (error) throw error;
      } catch (error) {
        console.error(error);
      }
    }
  }

  const addFriend = async (user1, user2) => {
    try {
      const { error } = await supabase
        .from('user_friend')
        .insert({
          user_id_1: user1,
          user_id_2: user2
        });
      if (error) throw error;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="friends-container">
      <h2 className="heading">Requests</h2>
      <div className="requests-container">
        {user && requests.length > 0 ?
          (requests.map((req) => {
            if(req.user_receive.id === user.id) {
              return (
                <div key={req.user_send.id} className="user">
                  <div className="user-info">
                    <div className="user-name">{req.user_send.name}</div>
                    <div className="user-email">{req.user_send.email}</div>
                  </div>
                  <div className="request-buttons">
                    <button type="button" className="add-user" onClick={() => handleRequestChoice('ACCEPTED', req)}>
                      <div className="checkmark"></div>
                    </button>
                    <button type="button" className="ignore-button" onClick={() => handleRequestChoice('IGNORED', req)}>
                      <div className="ignore-user"></div>
                    </button>
                  </div>
                </div>
              )
            } else {
              return;
            }
          })) : null}
      </div>
      <h2 className="heading">Friends</h2>
      {user && friends.length > 0 ?
          (friends.map((friend) => {
            const currentFriend = friend.user_id_2;
            return (
              <div key={currentFriend.id} className="user">
                <div className="user-info">
                  <div className="user-name">{currentFriend.name}</div>
                  <div className="user-email">{currentFriend.email}</div>
                </div>
              </div>
            )
          })) : null}
      {user && requests.length > 0 ?
          (requests.map((req) => {
            if(req.user_send.id === user.id) {
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
            } else {
              return;
            }
          })) : null}
      <button type="button" className="button add-friends-button" onClick={() => setAddFriendOpen(true)}>Add friend</button>
      {addFriendOpen ?
        <AddFriend setAddFriendOpen={setAddFriendOpen} />
        : null
      }
    </div>
  )
}

export default Friends;