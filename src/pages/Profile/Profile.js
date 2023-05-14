import { useParams } from 'react-router-dom';
import './Profile.scss';
import { useGetAccountQuery } from '../../slices/accountSlice';
import Header from '../../components/Header/Header';
import Avatar from '../../components/Avatar/Avatar';
import FriendAction from '../FriendAction/FriendAction';

const Profile = () => {
  let { id } = useParams();
  const {
    data: profileUser,
    isSuccess: profileUserFetched,
  } = useGetAccountQuery(id);

  return (
    <>
      <Header type="title"/>
      {profileUserFetched && (
        <div className="profile">
          <div className="profile-info">
            <div className="profile__user">
              <div className="profile__avatar">
                <Avatar url={profileUser?.avatar_url} classes="white-border" size={50} />
              </div>
              <div className="profile__info-text">
                <h1 className="profile__name">{profileUser?.name}</h1>
                <p className="profile__username">{profileUser?.email}</p>
              </div>
            </div>
            <div className="profile__friend-actions">
              <div className="profile__friend-actions--left">
                <FriendAction friend={profileUser} />
                <button className="button button--small button--border-none button--flat">Add expense</button>
              </div>
              <button className="button button--small button--border-none button--flat">Pay up</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile;