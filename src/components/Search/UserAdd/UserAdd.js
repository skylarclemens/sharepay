import './UserAdd.scss';
import UserResult from '../UserResult/UserResult';

const UserAdd = ({ user, type = 'user', handleSelect }) => {
  return (
    <button type="button" key={`${user.id}-user-add`} className="search-user search-user--add" onClick={() => handleSelect(user)}>
      <UserResult user={user} type={type} />
      <div className="add-user-search">
        <div className="add-user-plus"></div>
      </div>
    </button>
  )
}

export default UserAdd;