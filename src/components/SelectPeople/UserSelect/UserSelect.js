import './UserSelect.scss';
import Avatar from '../../Avatar/Avatar';
import { useState } from 'react';

const UserSelect = ({ user, selectedUsers, handleSelect }) => {
  const [selected, setSelected] = useState(
    selectedUsers.find(selected => selected.id === user.id));

  return (
    <button type="button" key={user.id} className={`search-user button--icon ${selected ? 'selected' : ''}`} onClick={() => {
      handleSelect(user, !selected)
      setSelected(!selected)
    }}>
      <div className="user-info">
        <Avatar url={user.avatar_url} classes="white-border" size={40} />
        <div className="user-info-text">
          <div className="user-name">{user.name}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </div>
      <div className="select">
        <div className="select-check"></div>
      </div>
    </button>
  )
}

export default UserSelect;