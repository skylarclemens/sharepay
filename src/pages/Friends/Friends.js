import './Friends.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import Header from '../../components/Header/Header';
import addFriendImg from '../../images/Add_friend.svg';
import { addFriend, useGetFriendsQuery } from '../../slices/friendSlice';
import { fetchFriendRequests, getRequestsStatus, selectAllFriendRequests, updateRequestStatus } from '../../slices/friendRequestSlice';

const Friends = () => {
  const requests = useSelector(selectAllFriendRequests);
  const requestsStatus = useSelector(getRequestsStatus);
  const user = useSelector(state => state.auth.user);
  const groups = useSelector(state => state.groups.data);
  const dispatch = useDispatch();

  const {
    data: friends,
    isSuccess
  } = useGetFriendsQuery(user?.id);

  useEffect(() => {
    const getFriendRequests = async () => {
      try {
        await dispatch(fetchFriendRequests(user?.id)).unwrap();
      } catch (rejectedValueOrSerializedError) {
        console.error(rejectedValueOrSerializedError);
      }
    }
    if(requestsStatus === 'idle') {
      getFriendRequests();
    }
  }, [user, requestsStatus, dispatch]);

  const handleRequestAccepted = async (req) => {
    try {
      await dispatch(updateRequestStatus({ status: 1, userId: req.user_id, friendId: user.id })).unwrap();
    } catch (rejectedValueOrSerializedError) {
      console.error(rejectedValueOrSerializedError);
    }

    try {
      await dispatch(addFriend({ user: req.friend_id, friend: req.user_id })).unwrap();
    } catch (rejectedValueOrSerializedError) {
      console.error(rejectedValueOrSerializedError);
    }
  }

  const handleRequestIgnored = async (req) => {
    try {
      await dispatch(updateRequestStatus({ status: 2, userId: req.user_id, friendId: user.id })).unwrap();
    } catch (rejectedValueOrSerializedError) {
      console.error(rejectedValueOrSerializedError);
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
        {user && requests.length > 0 ? (
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
        <h2 className="heading">Friends</h2>
        {user && isSuccess && friends.length > 0
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
        {user && requests.length > 0
          ? requests.map(req => {
              if (req.user_id.id === user.id) {
                return (
                  <div key={req.friend_id} className="user">
                    <div className="user-info">
                      <Avatar url={req.friend_id.avatar_url} />
                      <div className="user-info-text">
                        <div className="user-name">{req.friend_id.name}</div>
                        <div className="user-email">
                          {req.friend_id.email}
                        </div>
                      </div>
                    </div>
                    {req.status === 0 ? (
                      <div className="pill">PENDING</div>
                    ) : null}
                  </div>
                );
              }
              return null;
            })
          : null}

        <div className="groups-container">
          <h2 className="heading">Groups</h2>
          {groups.length > 0
            ? groups.map(group => {
                return (
                  <Link
                    to={`/group/${group.id}`}
                    key={group.id}
                    className="group"
                  >
                    <span>{group.group_name}</span>
                    <div className="arrow arrow--right"></div>
                  </Link>
                );
              })
            : null}
          <Link className="button button--link" to="/new-group">
            Create a group
          </Link>
        </div>
      </div>
    </>
  );
};

export default Friends;
