import './Friends.scss';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import Header from '../../components/Header/Header';
import addFriendImg from '../../images/Add_friend.svg';
import { useGetFriendsQuery, useAddNewFriendMutation } from '../../slices/friendSlice';
import { useGetFriendRequestsQuery, useUpdateFriendRequestStatusMutation } from '../../slices/friendRequestSlice';


const Friends = () => {
  const user = useSelector(state => state.auth.user);

  const {
    data: friends,
    isSuccess: friendsSuccess
  } = useGetFriendsQuery(user?.id);

  const [addNewFriend] = useAddNewFriendMutation();
  const [updateFriendRequest] = useUpdateFriendRequestStatusMutation();

  const {
    data: requests,
    isSuccess: requestsSuccess
  } = useGetFriendRequestsQuery(user?.id);

  const handleRequestAccepted = async (req) => {
    try {
      await updateFriendRequest({ status: 1, userId: req.user_id, friendId: user.id }).unwrap();
    } catch (error) {
      console.error(error);
    }

    try {
      await addNewFriend({ user: req.friend_id, friend: req.user_id }).unwrap();
    } catch (error) {
      console.error(error);
    }
  }

  const handleRequestIgnored = async (req) => {
    try {
      await updateFriendRequest({ status: 2, userId: req.user_id, friendId: user.id }).unwrap();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Header
        type="main"
        headerRight={
          <Link to="/add-friend">
            <img src={addFriendImg} alt="Add Friend Icon" />
          </Link>
        }
      />
      <div className="friends-container">
        {(requestsSuccess && requests.length > 0) ? (
          <>
            <h2 className="heading">Requests</h2>
            <div className="requests-container">
              {requests.map(req => {
                return (
                  req.status === 0 ? (
                  <div key={req.id} className="user">
                    <div className="user-info">
                      <Avatar url={req.from.avatar_url} />
                      <div className="user-info-text">
                        <div className="user-name">{req.from.name}</div>
                        <div className="user-email">
                          {req.from.email}
                        </div>
                      </div>
                    </div>
                    <div className="request-buttons">
                      <button
                        type="button"
                        className="add-user"
                        onClick={() => handleRequestAccepted(req)}
                      >
                        <div className="checkmark"></div>
                      </button>
                      <button
                        type="button"
                        className="ignore-button"
                        onClick={() => handleRequestIgnored(req)}
                      >
                        <div className="ignore-user"></div>
                      </button>
                    </div>
                  </div>) : null)
              })}
            </div>
          </>
        ) : null}
        {friendsSuccess
          ? friends.map(friend => {
              return (
                <Link
                  key={friend.id}
                  className="user"
                  to={`/friend/${friend.id}`}
                >
                  <div className="user-info">
                    <Avatar url={friend.avatar_url} />
                    <div className="user-info-text">
                      <div className="user-name">{friend.name}</div>
                      <div className="user-email">{friend.email}</div>
                    </div>
                  </div>
                  <div className="arrow arrow--right"></div>
                </Link>
              );
            })
          : null}
        {requestsSuccess
          ? requests.map(req => {
              if (req?.user_id.id === user.id) {
                return (
                  <div key={req?.friend_id} className="user">
                    <div className="user-info">
                      <Avatar url={req?.friend_id.avatar_url} />
                      <div className="user-info-text">
                        <div className="user-name">{req?.friend_id.name}</div>
                        <div className="user-email">
                          {req?.friend_id.email}
                        </div>
                      </div>
                    </div>
                    {req?.status === 0 ? (
                      <div className="pill">PENDING</div>
                    ) : null}
                  </div>
                );
              }
              return null;
            })
          : null}
      </div>
    </>
  );
};

export default Friends;
