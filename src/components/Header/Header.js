import './Header.scss';
import logo from '../../images/logo.png';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ type = 'main', title, headerLeft, headerFnLeft, headerRight, headerFnRight }) => {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  let headerLeftContent;

  if(headerLeft === 'back') {
    headerLeftContent = <div className="arrow arrow--left arrow--back-arrow arrow--white"></div>;
  }

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
  } else if (type === 'title') {
    return (
      <div className="header-container">
        <div className="title-header header">
          <button
            type="button"
            className="arrow-container--back-arrow"
            title="Back button"
            alt="Back button"
            onClick={headerFnLeft || (() => navigate(-1))}
          >
            {headerLeft ? headerLeft : (
              <div className="arrow arrow--left arrow--back-arrow arrow--white"></div> 
            )}
          </button>
          <span>{title}</span>
          {headerRight ? (
            <div className="title-right">
              <button type="button" className="button--icon" onClick={headerFnRight}>
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
