import './Header.scss';
import logo from '../../images/logo.png';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ type = 'main', title, headerLeft, headerLeftFn, headerRight, headerRightFn }) => {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  if (type === "main") {
    return (
      <div className="header-container">
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
      </div>
    )
  } else if (type === 'main-title') {
    return (
      <div className="header-container">
        <div className="main-header header">
          <span className="title">{title}</span>
          {headerRight ? (
            <div className="title-right">
              <button type="button" className="button--icon" onClick={headerRightFn}>
                {headerRight}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
   else if (type === 'title') {
    return (
      <div className="header-container">
        <div className="title-header header">
          {headerLeft ? headerLeft : (
            <button
            type="button"
            className="arrow-container--back-arrow"
            title="Back button"
            alt="Back button"
            onClick={headerLeftFn || (() => navigate(-1))}>
              <div className="arrow arrow--left arrow--back-arrow arrow--white"></div>
            </button>
          )}
          <span className="title">{title}</span>
          {headerRight ? (
            <div className="title-right">
              <button type="button" className="button--icon" onClick={headerRightFn}>
                {headerRight}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
};

export default Header;
