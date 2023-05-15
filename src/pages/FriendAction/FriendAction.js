import './FriendAction.scss';
import { useSelector } from 'react-redux';
import { useGetFriendQuery } from '../../slices/friendSlice';
import { useAddFriendRequestMutation, useGetFriendRequestsQuery } from '../../slices/friendRequestSlice';
import downArrow from '../../images/Arrow_down.svg';

const FriendAction = ({ friend }) => {
  const user = useSelector(state => state.auth.user);
  const {
    data: usersFriend,
    isFetching: usersFriendFetching,
    isSuccess: usersFriendFetched,
    isError: usersFriendError
  } = useGetFriendQuery(friend?.id);

  const {
    data: friendRequest,
    isSuccess: friendRequestFetched,
  } = useGetFriendRequestsQuery(friend?.id, {
    skip: !usersFriendError && !usersFriendFetching
  });

  const [addFriendRequest, {
    isLoading: addFriendRequestLoading,
    isSuccess: addFriendRequestSuccess,
    isError: addFriendRequestError,
   }] = useAddFriendRequestMutation();

  const isFriend = (usersFriendFetched && usersFriend);
  const friendStatus = friendRequest ? friendRequest?.status : -1;

  const sendFriendRequest = async () => {
    try {
      await addFriendRequest({ userId: user.id, friendId: friend.id }).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFriendClick = () => {
    console.log('friend clicked');
  }

  const friendRequestText = 
    addFriendRequestLoading ? 'Sending' :
    addFriendRequestSuccess ? 'Requested' :
    addFriendRequestError ? 'Error' :
    'Add';

  return (
    <>
      {isFriend && (
        <button className="button button--with-icon button--medium button--border-none button--flat button--disabled"
          onClick={() => handleFriendClick()}>
            {isFriend ? (
              <>
                <span>Friends</span>
                <img src={downArrow} alt="Down arrow" className="button__icon down-arrow" />
              </>
            ) :
              friendStatus === 0 ? 'Requested' : ''}
            
          </button>
      )}
      {friendRequestFetched && friendRequest?.status === 0 && (
          <button className="button button--with-icon button--medium button--border-none button--flat button--disabled" disabled={true}>
            Requested
          </button>
        )
      }
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
