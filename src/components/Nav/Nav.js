import './Nav.scss';
import homeImg from '../../images/Home.svg';
import groupImg from '../../images/Group.svg';
import graphImg from '../../images/Graph.svg';
import profileImg from '../../images/Profile.svg';
import { Link } from 'react-router-dom';

const Nav = ({setExpenseOpen}) => {
  return (
    <div className="nav-container">
      <div className="nav-buttons-container">
        <div className="nav-buttons nav-buttons-left">
          <Link to="/">
            <img src={homeImg} />
          </Link>
          <Link to="/friends">
            <img src={groupImg} />
          </Link>
        </div>
        <div className="nav-buttons nav-buttons-right">
          <Link to="/">
            <img src={graphImg} />
          </Link>
          <Link to="/account">
            <img src={profileImg} />
          </Link>
        </div>
      </div>
      <button type="button" className="add-button" onClick={() => setExpenseOpen(true)}><div className="add-plus"></div></button>
    </div>
  )
}

export default Nav;