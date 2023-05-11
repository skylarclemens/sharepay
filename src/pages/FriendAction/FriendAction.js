import './FriendAction.scss';
import { useSelector } from 'react-redux';
import { useGetFriendQuery } from '../../slices/friendSlice';
import { useAddFriendRequestMutation } from '../../slices/friendRequestSlice';
import downArrow from '../../images/Arrow_down.svg';

const FriendAction = ({ friend }) => {
  const user = useSelector(state => state.auth.user);
  const {
    data: isUsersFriend,
    isSuccess: isUsersFriendFetched,
  } = useGetFriendQuery(friend?.id);

  const [addFriendRequest, {
    isLoading: addFriendRequestLoading,
    isSuccess: addFriendRequestSuccess,
    isError: addFriendRequestError,
   }] = useAddFriendRequestMutation();
  const isFriend = (isUsersFriendFetched && isUsersFriend);

  const sendFriendRequest = async () => {
    try {
      await addFriendRequest({ user: user.id, friend: friend.id }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    {isUsersFriendFetched && (
      <button className={`button button--with-icon button--small button--border-none button--flat ${addFriendRequestLoading || addFriendRequestSuccess || addFriendRequestError || isFriend ? 'button--disabled' : ''}`}
        disabled={addFriendRequestLoading || addFriendRequestSuccess || addFriendRequestError || isFriend}
        onClick={() => sendFriendRequest()}>
          {isFriend ? (
            <>
              <span>Friends</span>
              <img src={downArrow} alt="Down arrow" className="button__icon down-arrow" />
            </>
          ) : 'Add'}
          {addFriendRequestLoading && '...'}
          {addFriendRequestSuccess && 'Sent'}
          {addFriendRequestError && 'Error'}
        </button>
    )}
    </>
  );
};

export default FriendAction;
