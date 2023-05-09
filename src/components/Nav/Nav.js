import './Nav.scss';
import homeImg from '../../images/Home.svg';
import groupImg from '../../images/Group.svg';
import graphImg from '../../images/Graph.svg';
import profileImg from '../../images/Profile.svg';
import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();
  const selectedPath = linkPath => location.pathname.split('/')[1] === linkPath && 'selected';

  return (
    <div className="nav-container">
      <div className="nav-buttons-container">
        <div className="nav-buttons nav-buttons-left">
          <Link className={`nav-button ${selectedPath('')}`} to="/">
            <img src={homeImg} alt="Home icon" />
          </Link>
          <Link
            className={`nav-button ${selectedPath('people')}`}
            to="/people/friends"
          >
            <img src={groupImg} alt="Friends and groups icon" />
          </Link>
        </div>
        <div className="nav-buttons nav-buttons-right">
          <Link
            className={`nav-button ${selectedPath('recent')}`}
            to="/recent"
          >
            <img src={graphImg} alt="Graph icon" />
          </Link>
          <Link
            className={`nav-button ${selectedPath('account')}`}
            to="/account"
          >
            <img src={profileImg} alt="Account icon" />
          </Link>
        </div>
      </div>
      <Link className="add-button" to="/new-expense">
        <div className="add-plus"></div>
      </Link>
    </div>
  );
};

export default Nav;
