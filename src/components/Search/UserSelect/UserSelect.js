import UserResult from '../UserResult/UserResult';
import './UserSelect.scss';
import { useState } from 'react';

const UserSelect = ({ user, userSelected, handleSelect }) => {
  const initialSelected = userSelected;
  const [selected, setSelected] = useState(initialSelected);

  return (
    <button type="button" key={user.id} className={`search-user ${selected ? 'selected' : ''}`} onClick={() => {
      handleSelect(user, !selected)
      setSelected(!selected)
    }}>
      <UserResult user={user} />
      <div className="select">
        <div className="select-check"></div>
      </div>
    </button>
  )
}

export default UserSelect;