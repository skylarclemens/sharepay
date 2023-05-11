import './UserResult.scss';
import Avatar from "../../Avatar/Avatar"

const UserResult = ({ user, action = null, type = 'user' }) => {
  return (
    <div className="user-result" onClick={action}>
      <div className="user-info">
        <Avatar url={user.avatar_url} classes="white-border" size={40} type={type} />
        <div className="user-info-text">
          <div className="user-name">{type === 'user' ? user.name : user.group_name}</div>
          {type === 'user' && (
            <div className="user-email">{user.email}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserResult;