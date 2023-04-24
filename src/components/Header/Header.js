import './Header.scss';
import logo from '../../images/logo.png';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ type, title, headerRight, headerFn, headerFnLeft }) => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  return (
    <div className="header-container">
      {type === 'main' && (
        <div className="main-header header">
          <Link to="/">
            <img
              src={logo}
              className="header-logo"
              alt="Dollar sign Sharepay logo"
            />
          </Link>
          <div className="header-right">
            {user ? null : (
              <Link
                className="button button--transparent button--small"
                to="/login"
              >
                Log In
              </Link>
            )}
            {headerRight}
          </div>
        </div>
      )}
      {type === 'title' && (
        <div
          className={`title-header header ${headerRight ? 'header-right' : ''}`}
        >
          <button
            type="button"
            className="arrow-container--back-arrow"
            title="Back button"
            alt="Back button"
            onClick={headerFnLeft || (() => navigate(-1))}
          >
            <div className="arrow arrow--left arrow--back-arrow arrow--white"></div>
          </button>
          <span className="header-text">{title}</span>
          {headerRight ? (
            <div className="title-right">
              <button type="button" className="button--icon" onClick={headerFn}>
                {headerRight}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Header;
