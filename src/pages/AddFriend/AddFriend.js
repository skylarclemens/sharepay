import './AddFriend.scss';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useSelector } from 'react-redux';
import Avatar from '../../components/Avatar/Avatar';
import Header from '../../components/Header/Header';
import SelectPeople from '../../components/SelectPeople/SelectPeople';
import Modal from '../../components/Modal/Modal';
import Search from '../../components/Search/Search';

const AddFriend = ({ selectFriends = false, handleAddUser }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [openSelectPeople, setOpenSelectPeople] = useState(false);
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
    } catch (error) {
      console.error(error);
    }
  };

  const renderSuggestions = (
    <div className="suggested-users">
      {suggestions &&
        suggestions.map(suggestedUser => {
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
              </button>
            </div>
          );
        })}
    </div>
  )

  return (
    <>
      <Header type="title" title="Add friend" />
      <div className="add-friend-container">
        <Search value={value} setValue={setValue} suggestions={renderSuggestions} />
      </div>
    </>
  );
};

export default AddFriend;
