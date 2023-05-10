import './AddFriend.scss';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useSelector } from 'react-redux';
import Avatar from '../../components/Avatar/Avatar';
import Header from '../../components/Header/Header';

const AddFriend = ({ selectFriends = false, handleAddUser }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [requestSent, setRequestSent] = useState([]);
  const user = useSelector(state => state.auth.user);

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

  const sendFriendRequest = async userReceiveId => {
    try {
      const { error } = await supabase.from('user_friend').insert({
        user_id: user.id,
        friend_id: userReceiveId,
        status: 0,
      });
      if (error) throw error;
      setRequestSent([...requestSent, {
        id: userReceiveId,
        sent: true,
      }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header type="title" title="Add friend" />
      <div
        className={`add-friend-container ${selectFriends && 'select-friends'}`}
      >
        <div className="search-container">
          <input
            className="text-input"
            type="text"
            value={value}
            placeholder="Search"
            onChange={e => setValue(e.target.value)}
          />
        </div>
        <div className="suggested-users">
          {suggestions &&
            suggestions.map(suggestedUser => {
              const sentStatus =
                requestSent.find(request => request.id === suggestedUser.id) ?? false;
              console.log(sentStatus);
              return (
                <div key={suggestedUser.id} className="user">
                  <div className="user-info">
                    <Avatar url={suggestedUser.avatar_url} />
                    <div className="user-info-text">
                      <div className="user-name">{suggestedUser.name}</div>
                      <div className="user-email">{suggestedUser.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="add-user"
                    onClick={() => sendFriendRequest(suggestedUser.id)}
                  >
                    <div
                      className={`add-user-plus ${sentStatus && 'hide'}`}
                    ></div>
                    <div
                      className={`checkmark ${!sentStatus && 'hide'}`}
                    ></div>
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default AddFriend;
