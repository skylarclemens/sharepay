import './UserAdd.scss';
import UserResult from '../UserResult/UserResult';
import Button from '../../UI/Buttons/Button/Button';

const UserAdd = ({ user, type = 'user', handleSelect }) => {
  return (
    <Button variant="custom" backgroundColor={'#f4f6f8'} className="search-user search-user--add" onClick={() => handleSelect(user)}>
      <UserResult user={user} type={type} />
      <div className="add-user-search">
        <div className="add-user-plus"></div>
      </div>
    </Button>
  )
}

export default UserAdd;