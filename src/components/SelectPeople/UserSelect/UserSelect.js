import './UserSelect.scss';
import Avatar from '../../Avatar/Avatar';

const UserSelect = ({ user, handleSelect }) => {
  return (
    <div key={user.id} className="search-user">
      <div className="user-info">
        <Avatar url={user.avatar_url} classes="white-border" size={40} />
        <div className="user-info-text">
          <div className="user-name">{user.name}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </div>
      <button
        type="button"
        className="select"
        onClick={() => handleSelect(user)}
      >
        <div
          className={`select-check`}
        ></div>
        {/* Need to fix sentStatus to show if user already added friend/user */}
      </button>
    </div>
  )
}

export default UserSelect;