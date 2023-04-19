import './Friends.scss';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import Header from '../../components/Header/Header';
import addFriendImg from '../../images/Add_friend.svg';

const Friends = () => {
  const [requests, setRequests] = useState([]);
  const friends = useSelector(state => state.friends.data);
  const user = useSelector(state => state.user);

  useEffect(() => {
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
              email,
              avatar_url
            ),
            user_receive (
              id,
              name,
              email,
              avatar_url
            )
          `)
          .or(`user_send.eq.${user.id},user_receive.eq.${user.id}`);
        if (error) throw error;
        setRequests(data);
      } catch (error) {
        console.error(error);
      }
    }

    getRequests();
  }, [user]);

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
    <>
      <Header type="main" headerRight={
        <Link to="/add-friend">
          <img src={addFriendImg} alt="Add Friend Icon" />
        </Link>
      }/>
      <div className="friends-container">
        {user && requests.length > 0 ?
        <>
          <h2 className="heading">Requests</h2>
          <div className="requests-container">
            {requests.map((req) => {
              if(req.user_receive.id === user.id) {
                return (
                  <div key={req.user_send.id} className="user">
                    <div className="user-info">
                      <Avatar url={req.user_send.avatar_url} />
                      <div className="user-info-text">
                        <div className="user-name">{req.user_send.name}</div>
                        <div className="user-email">{req.user_send.email}</div>
                      </div>
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
              }
              return null;
            })}
          </div>
        </> : null}
        <h2 className="heading">Friends</h2>
        {user && friends.length > 0 ?
            (friends.map((friend) => {
              return (
                <Link key={friend.id} className="user" to={`/friend/${friend.id}`}>
                  <div className="user-info">
                    <Avatar url={friend.avatar_url} />
                    <div className='user-info-text'>
                      <div className="user-name">{friend.name}</div>
                      <div className="user-email">{friend.email}</div>
                    </div>
                  </div>
                  <div className="arrow arrow--right"></div>
                </Link>
              )
            })) : null}
        {user && requests.length > 0 ?
            (requests.map((req) => {
              if(req.user_send.id === user.id) {
                return (
                  <div key={req.user_receive.id} className="user">
                    <div className="user-info">
                      <Avatar url={req.user_send.avatar_url} />
                      <div className='user-info-text'>
                        <div className="user-name">{req.user_receive.name}</div>
                        <div className="user-email">{req.user_receive.email}</div>
                      </div>
                    </div>
                    {req.status === 'SENT' ?
                      <div className="pill">PENDING</div>
                      : null
                    }
                  </div>
                )
              }
              return null;
            })) : null}
        <div className="groups-container">
          <h2 className="heading">Groups</h2>
          <Link className="button button--link" to="/new-group">Create a group</Link>
        </div>
      </div>
    </>
  )
}

export default Friends;