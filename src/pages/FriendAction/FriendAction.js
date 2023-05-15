import './FriendAction.scss';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useGetFriendQuery, useRemoveFriendMutation } from '../../slices/friendSlice';
import { useAddFriendRequestMutation, useGetFriendRequestQuery } from '../../slices/friendRequestSlice';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import downArrow from '../../images/Arrow_down.svg';
import unfriendImg from '../../images/Unfriend.svg';


const FriendAction = ({ friend }) => {
  const user = useSelector(state => state.auth.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setShowDropdown(false));

  const {
    data: usersFriend,
    isFetching: usersFriendFetching,
    isSuccess: usersFriendFetched,
    isError: usersFriendError
  } = useGetFriendQuery(friend?.id);

  const {
    data: friendRequest,
    isSuccess: friendRequestFetched,
  } = useGetFriendRequestQuery({ userId: user.id, friendId: friend?.id }, {
    skip: !usersFriendError && !usersFriendFetching
  });

  const [addFriendRequest, {
    isLoading: addFriendRequestLoading,
    isSuccess: addFriendRequestSuccess,
    isError: addFriendRequestError,
   }] = useAddFriendRequestMutation();

  const [removeFriend, {
    isLoading: removeFriendLoading,
    isSuccess: removeFriendSuccess,
  }] = useRemoveFriendMutation();

  const isFriend = (usersFriendFetched && usersFriend);

  const sendFriendRequest = async () => {
    try {
      await addFriendRequest({ userId: user.id, friendId: friend?.id }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const removeCurrentFriend = async () => {
    try {
      await removeFriend({ userId: user.id, friendId: friend?.id }).unwrap();
    } catch (error) {
      console.error(error);
      return;
    }

    try {
      await removeFriend({ userId: friend?.id, friendId: user.id }).unwrap();
    } catch (error) {
      console.error(error);
    }
  }

  const handleFriendClick = () => {
    if(isFriend) {
      setShowDropdown(!showDropdown);
    }
    return;
  }

  const handleUnfriend = () => {
    setShowDropdown(false);
    removeCurrentFriend();
    return;
  }

  const friendRequestText = 
    addFriendRequestLoading ? 'Sending' :
    addFriendRequestSuccess ? 'Requested' :
    addFriendRequestError ? 'Error' :
    'Add';
  const friendButtonText = 
    removeFriendLoading ? 'Removing' :
    removeFriendSuccess ? 'Removed' :
    'Friends';

  return (
    <>
      {isFriend && (
        <div ref={dropdownRef} className="friend-actions-container">
          <button className="button button--with-icon button--medium button--border-none button--flat button--disabled"
            onClick={() => handleFriendClick()}>
              <span>{friendButtonText}</span>
              <img src={downArrow} alt="Down arrow" className="button__icon down-arrow" />
          </button>
          <div className={`friend-dropdown ${showDropdown ? '' : 'hide'}`}>
            <button className="button--no-style friend-dropdown__item" onClick={() => handleUnfriend()}>
              <img src={unfriendImg} alt="Unfriend Icon" className="friend-dropdown__icon" />
              <span>Unfriend</span>
            </button>
          </div>
        </div>
      )}
      {friendRequestFetched && friendRequest?.status === 0 && (
        <button className="button button--with-icon button--medium button--border-none button--flat button--disabled" disabled={true}>
          Requested
        </button>
      )}
      {usersFriendError && friendRequest?.length === 0 && (
        <button className={`button button--with-icon button--medium button--border-none button--flat ${addFriendRequestLoading || addFriendRequestSuccess || addFriendRequestError ? 'button--disabled' : ''}`}
          onClick={() => sendFriendRequest()}
          disabled={addFriendRequestLoading || addFriendRequestSuccess || addFriendRequestError}>
          {friendRequestText}
        </button>
      )}
    </>
  );
};

export default FriendAction;
