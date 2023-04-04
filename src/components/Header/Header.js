import './Header.scss';
import logo from '../../images/logo.png';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ type, title, titleRight, titleFunction }) => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  return (
    <>
      {type === 'main' && ( 
        <div className="main-header header">
          <Link to="/">
            <img src={logo} className="header-logo" alt="Dollar sign Sharepay logo" />
          </Link>
          <div className="header-right">
            {user ? null : 
              <Link className="button button--transparent button--small" to="/login">Log In</Link>
              }
          </div>
        </div>
      )}
      {type === 'title' && (
        <div className="title-header header">
          <button type="button" className="back-arrow" title="Back button" alt="Back button" onClick={() => navigate(-1)}></button>
          <span className="header-text">{title}</span>
          {titleRight ? (
            <div className="title-right">
              <button type="button" className="button--icon" onClick={titleFunction}>
                {titleRight}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </>
  )
}

export default Header;