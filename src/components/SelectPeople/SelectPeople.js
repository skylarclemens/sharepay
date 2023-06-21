import './SelectPeople.scss';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../Header/Header';
import UserSelect from '../Search/UserSelect/UserSelect';
import UserAdd from '../Search/UserAdd/UserAdd';
import Search from '../Search/Search';
import { useGetFriendsQuery, selectFriendsBySearchQuery } from '../../slices/friendSlice';
import { useGetGroupsQuery, selectGroupsBySearchQuery } from '../../slices/groupSlice';
import { useDebounce } from '../../hooks/useDebounce';
import Avatar from '../Avatar/Avatar';
import removeImg from '../../images/Remove.svg';

const SelectPeople = ({ showGroups = false, handleAdd, existingUsers = [], setOpen }) => {
  const [value, setValue] = useState('');
  const debouncedSearchValue = useDebounce(value, 500);

  const [selectedUsers, setSelectedUsers] = useState(existingUsers ?? []);
  const [searchActive, setSearchActive] = useState(false);
  const onFocus = () => setSearchActive(true);
  const onBlur = () => setSearchActive(false);
  const user = useSelector(state => state.auth.user);
  const searchInput = useRef(null);

  const {
    data: groupSuggestions,
    isSuccess: groupResultsFetched,
  } = useGetGroupsQuery(user?.id, {
    skip: debouncedSearchValue.length === 0 || !showGroups,
    selectFromResult: (result) => ({
      data: selectGroupsBySearchQuery(result, debouncedSearchValue),
      isSuccess: result.isSuccess
    })
  });
  const {
    data: friendSuggestions,
    isSuccess: friendResultsFetched
  } = useGetFriendsQuery(user?.id, {
    skip: debouncedSearchValue.length === 0,
    selectFromResult: (result) => ({
      data: selectFriendsBySearchQuery(result, debouncedSearchValue),
      isSuccess: result.isSuccess,
    })
  });

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
        {(groupResultsFetched && groupSuggestions.length > 0) && <span className="search-heading">Groups</span>}
        {(groupResultsFetched && groupSuggestions.length > 0) && (
          groupSuggestions.map(suggested => {
            return (
              <UserAdd key={suggested.id} user={suggested} type="group" handleSelect={() => handleAdd(suggested)} />
            );
          })
        )}
      </div>
      <div className="results">
        {(friendResultsFetched && friendSuggestions.length > 0) && <span className="search-heading">Friends</span>}
        {(friendResultsFetched && friendSuggestions.length > 0) &&
          friendSuggestions.map(suggested => {
            const userSelected = selectedUsers.find(selected => selected.id === suggested.id) ?? false;
              return (
                <UserSelect key={suggested.id} userSelected={!!userSelected} user={suggested} handleSelect={handleUserSelected} />
              )
          })}
      </div>
    </>
  )

  return (
    <>
      <Header type="title" title="Select people" classes="gray" headerLeftFn={() => setOpen(false)} headerRight={
        <span style={{
          fontSize: '1rem',
          fontFamily: 'Inter',
          fontWeight: '600',
          color: '#6c91c2'
        }}>Add</span>
      } headerRightFn={() => handleAdd(selectedUsers)} />
      <div className="add-friend-container select-friends">
        <div className="search-split-container">
          <div className="split-with-people">
            <div className="split-with-people__heading">
              <span className="section-heading">Split with</span>
            </div>
            <div className="split-with-people__users">
            {selectedUsers.map(user => {
              return (
                <div key={`search-${user.id}`} className="split-with-user">
                  <Avatar url={user?.avatar_url} size={35} classes="white-border" />
                  <span>{user?.name}</span>
                  <button className="button--no-style remove-user">
                    <img src={removeImg} alt="Remove user" onClick={() => setSelectedUsers(selectedUsers.filter(selected => selected.id !== user.id))} />
                  </button>
                </div>
              )})}
              </div>
          </div>
          <Search value={value} setValue={setValue} onFocus={onFocus} onBlur={onBlur} suggestions={renderSuggestions} ref={searchInput} />
        </div>
      </div>
    </>
  );
};

export default SelectPeople;
