import './SelectPeople.scss';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../Header/Header';
import UserSelect from './UserSelect/UserSelect';
import GroupSelect from './GroupSelect/GroupSelect';
import { supabase } from '../../supabaseClient';
import { useGetFriendsQuery } from '../../slices/friendSlice';
import { useGetGroupsQuery } from '../../slices/groupSlice';

const SelectPeople = ({ newFriends = false, showGroups = false, handleAdd }) => {
  const [value, setValue] = useState('');
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const [groupSuggestions, setGroupSuggestions] = useState([]);
  /*const [requestSent, setRequestSent] = useState({
    id: '',
    sent: false,
  });*/
  const user = useSelector(state => state.auth.user);
  const {
    data: friends
  } = useGetFriendsQuery(user?.id);
  const {
    data: groups
  } = useGetGroupsQuery(user?.id);

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
          setFriendSuggestions(data);
        } catch (error) {
          console.error(error);
        }
      } else {
        const suggestedFriends = friends.filter(
          friend =>
            friend.name.toLowerCase().includes(value.toLowerCase()) ||
            friend.email.toLowerCase().includes(value.toLowerCase())
        ) ?? [];
        if (showGroups) {
          const suggestedGroups = groups.filter(
            group => 
              group.group_name.toLowerCase().includes(value.toLowerCase())
          ) ?? [];
          setGroupSuggestions(suggestedGroups);
        }
        setFriendSuggestions(suggestedFriends);

      }
    };

    if (value.length > 0) {
      let debouncer = setTimeout(() => {
        handleSearch();
      }, inputTimer);

      return () => clearTimeout(debouncer);
    } else {
      setFriendSuggestions([]);
      setGroupSuggestions([]);
      return;
    }
  }, [value, user, friends, newFriends, groups, showGroups]);

  const handleAddFriend = suggested => {
    /*setRequestSent({
      id: suggested.id,
      sent: true,
    });*/
    handleAdd(suggested);
  };

  const handleAddGroup = suggested => {
    handleAdd(suggested);
  };

  return (
    <div className={`add-friend-container ${!newFriends && 'select-friends'}`}>
      <Header type="title" title="Select people" />
      <div className="search-container">
        <input
          className="text-input search-input"
          type="search"
          value={value}
          placeholder="Search for people..."
          onChange={e => setValue(e.target.value)}
        />
      </div>
      <div className="suggested-users">
        <div className="results-container">
          {groupSuggestions.length > 0 && <span className="search-heading">Groups</span>}
          {groupSuggestions.length > 0 && (
            groupSuggestions.map(suggested => {
              return (
                <GroupSelect key={suggested.id} group={suggested} handleSelect={() => handleAddGroup(suggested)} />
              );
            })
          )}
        </div>
        <div className="results-container">
          {friendSuggestions.length > 0 && <span className="search-heading">Friends</span>}
          {friendSuggestions.length > 0 &&
            friendSuggestions.map(suggested => {
              return (
                <UserSelect key={suggested.id} user={suggested} handleSelect={() => handleAddFriend(suggested)} />
              )
            })}
          </div>
        </div>
    </div>
  );
};

export default SelectPeople;
