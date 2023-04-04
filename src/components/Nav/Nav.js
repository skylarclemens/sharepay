import './Nav.scss';
import homeImg from '../../images/Home.svg';
import groupImg from '../../images/Group.svg';
import graphImg from '../../images/Graph.svg';
import profileImg from '../../images/Profile.svg';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <div className="nav-container">
      <div className="nav-buttons-container">
        <div className="nav-buttons nav-buttons-left">
          <Link to="/">
            <img src={homeImg} alt="Home icon"/>
          </Link>
          <Link to="/friends">
            <img src={groupImg} alt="Friends icon"/>
          </Link>
        </div>
        <div className="nav-buttons nav-buttons-right">
          <Link to="/">
            <img src={graphImg} alt="Graph icon"/>
          </Link>
          <Link to="/account">
            <img src={profileImg} alt="Account icon"/>
          </Link>
        </div>
      </div>
      <Link className="add-button" to="/new-expense">
        <div className="add-plus"></div>
      </Link>
    </div>
  )
}

export default Nav;