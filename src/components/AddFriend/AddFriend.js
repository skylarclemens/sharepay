import './AddFriend.scss';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useSelector } from 'react-redux';
import Avatar from '../Avatar/Avatar';

const AddFriend = ({ setAddFriendOpen }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const user = useSelector(state => state.user);
  const [requestSent, setRequestSent] = useState({
    id: '',
    sent: false
  });

  const inputTimer = 1000;

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select()
          .neq('id', user.id)
          .or(`email.ilike.%${value}%,name.ilike.%${value}%`);
        if (error) throw error;
        setSuggestions(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (value.length > 0) {
      let debouncer = setTimeout(() => {
        handleSearch();
      }, inputTimer);

      return () => clearTimeout(debouncer);
    } else {
      setSuggestions([]);
      return;
    }
  }, [value, user]);

  const sendFriendRequest = async (userReceiveId) => {
    try {
      const { error } = await supabase
        .from('friend_request')
        .insert({
          user_send: user.id,
          user_receive: userReceiveId,
          status: 'SENT'
        });
      if (error) throw error;
      setRequestSent({
        id: userReceiveId,
        sent: true
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="add-friend-container">
      <div className="add-friend-header">
        <button type="button" className="back-arrow" title="Back button" alt="Back button" onClick={() => setAddFriendOpen(false)}></button>
        <span className="header-text">Add friend</span>
      </div>
      <div className="search-container">
        <h1>Add friend</h1>
        <input className="search-input" type="text" value={value} placeholder="Search" onChange={(e) => setValue(e.target.value)} />
      </div>
      <div className="suggested-users">
          {suggestions && suggestions.map((suggestedUser) => {
            const sentStatus = requestSent.id === suggestedUser.id && requestSent.sent ? true : false;
            return (
              <div key={suggestedUser.id} className="user">
                <div className="user-info">
                  <Avatar url={suggestedUser.avatar_url} />
                  <div className="user-info-text">
                    <div className="user-name">{suggestedUser.name}</div>
                    <div className="user-email">{suggestedUser.email}</div>
                  </div>
                </div>
                <button type="button" className="add-user" onClick={() => sendFriendRequest(suggestedUser.id)}>
                  <div className={`add-user-plus ${sentStatus ? 'hide' : ''}`}></div>
                  <div className={`checkmark ${sentStatus ? '' : 'hide'}`}></div>
                </button>
              </div>
            )
          })}
        </div>
    </div>
  )
}

export default AddFriend;