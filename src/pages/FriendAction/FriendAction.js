import './FriendAction.scss';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useGetFriendQuery, useRemoveFriendMutation } from '../../slices/friendSlice';
import { useAddFriendRequestMutation, useGetFriendRequestQuery } from '../../slices/friendRequestSlice';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import downArrow from '../../images/Arrow_down.svg';
import unfriendImg from '../../images/Unfriend.svg';
import Button from '../../components/UI/Buttons/Button/Button';


const FriendAction = ({ friend }) => {
  const user = useSelector(state => state.auth.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setShowDropdown(false));

  const {
    data: usersFriend,
    isSuccess: usersFriendFetched,
    isError: usersFriendError
  } = useGetFriendQuery(friend?.id);

  const {
    data: friendRequest,
  } = useGetFriendRequestQuery({ userId: user.id, friendId: friend?.id }, {
    skip: !usersFriendError
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
    friendRequest?.status === 0 ? 'Requested' :
    addFriendRequestError ? 'Error' :
    'Add';
  const friendButtonText = 
    removeFriendLoading ? 'Removing' :
    removeFriendSuccess ? 'Removed' :
    'Friends';

  return (
    <div className="friend-action">
      {isFriend && (
        <div ref={dropdownRef} className="friend-actions-container">
          <Button className="button--with-icon button--disabled"
            onClick={() => handleFriendClick()}>
              <span>{friendButtonText}</span>
              {!removeFriendSuccess && <img src={downArrow} alt="Down arrow" className="button__icon down-arrow" />}
          </Button>
          <div className={`friend-dropdown ${showDropdown ? '' : 'hide'}`}>
            <Button variant="text" className="friend-dropdown__item" onClick={() => handleUnfriend()}>
              <img src={unfriendImg} alt="Unfriend Icon" className="friend-dropdown__icon" />
              <span>Unfriend</span>
            </Button>
          </div>
        </div>
      )}
      {usersFriendError && (
        <Button className="button--with-icon button--border-none"
          onClick={() => sendFriendRequest()}
          disabled={addFriendRequestLoading || addFriendRequestSuccess || addFriendRequestError || friendRequest?.status === 0}>
          {friendRequestText}
        </Button>
      )}
    </div>
  );
};

export default FriendAction;
