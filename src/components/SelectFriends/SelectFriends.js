import './SelectFriends.scss';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../Header/Header';
import Avatar from '../Avatar/Avatar';
import { supabase } from '../../supabaseClient';

const SelectFriends = ({ newFriends = false, showGroups = false, handleAddUser }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [requestSent, setRequestSent] = useState({
    id: '',
    sent: false,
  });
  const user = useSelector(state => state.user);
  const friends = useSelector(state => state.friends.data);
  const groups = useSelector(state => state.groups.data);

  const inputTimer = 1000;

  useEffect(() => {
    const handleSearch = async () => {
      if (newFriends) {
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
      } else {
        const suggestedFriends = friends.filter(
          friend =>
            friend.name.toLowerCase().includes(value.toLowerCase()) ||
            friend.email.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(suggestedFriends);
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
  }, [value, user, friends, newFriends]);

  const handleAdd = friend => {
    setRequestSent({
      id: friend.id,
      sent: true,
    });
    handleAddUser(friend);
  };

  return (
    <div className={`add-friend-container ${!newFriends && 'select-friends'}`}>
      <Header type="title" title="Add friend" />
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
              requestSent.id === suggestedUser.id && requestSent.sent
                ? true
                : false;
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
                  onClick={() => handleAdd(suggestedUser)}
                >
                  <div
                    className={`add-user-plus ${sentStatus ? 'hide' : ''}`}
                  ></div>
                  <div
                    className={`checkmark ${sentStatus ? '' : 'hide'}`}
                  ></div>
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SelectFriends;
