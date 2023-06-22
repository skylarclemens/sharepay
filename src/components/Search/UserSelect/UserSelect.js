import Button from '../../UI/Buttons/Button/Button';
import UserResult from '../UserResult/UserResult';
import './UserSelect.scss';
import { useState } from 'react';

const UserSelect = ({ user, userSelected, handleSelect }) => {
  const initialSelected = userSelected;
  const [selected, setSelected] = useState(initialSelected);

  return (
    <Button
      variant='custom'
      className={`search-user ${selected ? 'selected' : ''}`}
      backgroundColor={'#f4f6f8'}
      onClick={() => {
        handleSelect(user, !selected)
        setSelected(!selected)
      }}>
      <UserResult user={user} />
      <div className="select">
        <div className="select-check"></div>
      </div>
    </Button>
  )
}

export default UserSelect;