import './Header.scss';
import logo from '../../images/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../../slices/userSlice';

const Header = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  
  const handleLogOut = () => {
    dispatch(removeUser());
  }

  return (
    <div className="header-container">
      <img src={logo} className="header-logo" alt="Dollar sign Sharepay logo" />
      <div className="header-right">
        {user ?
          <button className="button button--transparent button--small" onClick={handleLogOut}>Log Out</button> : ''}
      </div>
    </div>
  )
}

export default Header;