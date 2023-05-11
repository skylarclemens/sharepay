import './SelectPeople.scss';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../Header/Header';
import UserSelect from '../Search/UserSelect/UserSelect';
import UserAdd from '../Search/UserAdd/UserAdd';
import Search from '../Search/Search';
import { supabase } from '../../supabaseClient';
import { useGetFriendsQuery } from '../../slices/friendSlice';
import { useGetGroupsQuery } from '../../slices/groupSlice';

const SelectPeople = ({ newFriends = false, showGroups = false, handleAdd, existingUsers = [] }) => {
  const [value, setValue] = useState('');
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const [groupSuggestions, setGroupSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(existingUsers ?? []);
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

  const handleUserSelected = (suggested, selected) => {
    if (selected) {
      setSelectedUsers(selectedUsers => [...selectedUsers, suggested]);
    } else {
      setSelectedUsers(selectedUsers.filter(user => user.id !== suggested.id));
    }
  }

  const renderSuggestions = (
    <>
      <div className="results">
            {groupSuggestions.length > 0 && <span className="search-heading">Groups</span>}
            {groupSuggestions.length > 0 && (
              groupSuggestions.map(suggested => {
                return (
                  <UserAdd key={suggested.id} user={suggested} type="group" handleSelect={() => handleAdd(suggested)} />
                );
              })
            )}
      </div>
      <div className="results">
        {friendSuggestions.length > 0 && <span className="search-heading">Friends</span>}
        {friendSuggestions.length > 0 &&
          friendSuggestions.map(suggested => {
            const userSelected = selectedUsers.find(selected => selected.id === suggested.id) ?? false;
            if (newFriends && !userSelected) {
              return (
                <UserAdd key={suggested.id} user={suggested} handleSelect={() => handleAdd(suggested)} />
              )
            } else if (!newFriends) {
              return (
                <UserSelect key={suggested.id} userSelected={!!userSelected} user={suggested} handleSelect={handleUserSelected} />
              )
            }
            return null;
          })}
      </div>
    </>
  )

  return (
    <div className={`add-friend-container ${!newFriends && 'select-friends'}`}>
      <Header type="title" title="Select people" />
      <Search value={value} setValue={setValue} suggestions={renderSuggestions} />
      <button className={`button button--floating selected-users-button ${selectedUsers.length > 0 ? 'show' : ''}`} onClick={() => handleAdd(selectedUsers)}>{`Add friend${selectedUsers.length > 1 ? 's' : ''}`}</button>
    </div>
  );
};

export default SelectPeople;
