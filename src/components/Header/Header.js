import './Header.scss';
import logo from '../../images/logo.png';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {
  const user = useSelector(state => state.user);

  return (
    <div className="header-container">
      <Link to="/">
        <img src={logo} className="header-logo" alt="Dollar sign Sharepay logo" />
      </Link>
      <div className="header-right">
        {user ? null : 
          <Link className="button button--transparent button--small" to="/login">Log In</Link>
          }
      </div>
    </div>
  )
}

export default Header;