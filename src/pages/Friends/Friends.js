import './Friends.scss';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';
import Modal from '../../components/Modal/Modal';
import SearchPeople from '../../components/SearchPeople/SearchPeople';
import addFriendImg from '../../images/Add_friend.svg';
import searchImg from '../../images/Search.svg'
import { useGetFriendsQuery, useAddNewFriendMutation } from '../../slices/friendSlice';
import { useGetFriendRequestsQuery, useUpdateFriendRequestStatusMutation } from '../../slices/friendRequestSlice';
import UserResult from '../../components/Search/UserResult/UserResult';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';
import Button from '../../components/UI/Buttons/Button/Button';
import Checkmark from '../../components/Icons/Checkmark';
import Close from '../../components/Icons/Close';


const Friends = () => {
  const user = useSelector(state => state.auth.user);
  const [openSearchPeople, setOpenSearchPeople] = useState(false);

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
      <MainHeader
        title="Friends"
        right={
          <Button variant="icon" onClick={() => setOpenSearchPeople(true)}>
            <img style={{
              filter: 'brightness(0) invert(1)',  
            }}
            src={searchImg} className="header-icon" alt="Add Friend Icon" />
          </Button>
        }
      />
      <div className="friends-container">
        {(requestsSuccess && requests.length > 0) ? (
          <>
            <h2>Requests</h2>
            <div className="requests-container">
              {requests.map(req => {
                return (
                  req.status === 0 ? (
                  <div key={req.id} className="search-user">
                    <UserResult user={req?.from} />
                    <div className="request-buttons">
                      <Button
                        className="button--icon accept-request"
                        onClick={() => handleRequestAccepted(req)}
                      >
                        <Checkmark height="35px" width="35px" />
                      </Button>
                      <Button
                        className="button--icon ignore-request"
                        onClick={() => handleRequestIgnored(req)}
                      >
                        <Close height="35px" width="35px" />
                      </Button>
                    </div>
                  </div>) : null)
              })}
            </div>
          </>
        ) : null}
        <div className="friends-list">
          {friendsSuccess && friends?.length > 0
            ? friends.map(friend => {
                return (
                  <Link
                    key={friend.id}
                    className="search-user"
                    to={`/user/${friend.id}`}
                  >
                    <UserResult user={friend} />
                    <div className="arrow arrow--right"></div>
                  </Link>
                );
              })
            : null}
          </div>
        {friendsSuccess && friends?.length === 0 ? (
          <div className="no-people">
            <span>Add friends to start sharing expenses.</span>
            <div className="icon-details">
              <span>Tap the</span>
              <div className="add-people-img">
                <img className="add-people-icon" src={addFriendImg} alt="Add Friend Icon" />
              </div>
              <span>icon above to get started.</span>
            </div>
          </div>
          ) : null
          }
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
      <Modal open={openSearchPeople} fullScreen={true}>
        <SearchPeople setOpen={setOpenSearchPeople} />
      </Modal>
    </>
  );
};

export default Friends;
