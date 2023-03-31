import './Nav.scss';
import homeImage from '../../images/Home.svg';
import groupImage from '../../images/Group.svg';
import { Link } from 'react-router-dom';

const Nav = ({setExpenseOpen}) => {
  return (
    <div className="nav-container">
      <div className="nav-buttons-container">
        <div className="nav-buttons nav-buttons-left">
          <Link to="/">
            <img src={homeImage} />
          </Link>
          <Link to="/friends">
            <img src={groupImage} />
          </Link>
        </div>
        <div className="nav-buttons nav-buttons-right">
        </div>
      </div>
      <button type="button" className="add-button" onClick={() => setExpenseOpen(true)}><div className="add-plus"></div></button>
    </div>
  )
}

export default Nav;