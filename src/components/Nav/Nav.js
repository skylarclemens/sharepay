import './Nav.scss';
import homeImg from '../../images/Home.svg';
import friendImg from '../../images/Friend.svg'
import groupImg from '../../images/Group.svg';
import graphImg from '../../images/Graph.svg';
import addPlusImg from '../../images/Add_plus.svg';
import { Link, useLocation } from 'react-router-dom';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

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
            className={`nav-button ${selectedPath('friends')}`}
            to="/friends"
          >
            <img src={friendImg} alt="Friends icon" />
          </Link>
        </div>
        <div className="nav-buttons nav-buttons-right">
          <Link
              className={`nav-button ${selectedPath('groups')}`}
              to="/groups"
            >
            <img src={groupImg} alt="Groups icon" />
          </Link>
          <Link
            className={`nav-button ${selectedPath('activity')}`}
            to="/activity"
          >
            <img src={graphImg} alt="Graph icon" />
          </Link>
        </div>
      </div>
      <Link className="add-button"
        to="/new-expense"
        onClick={hapticsImpactLight}>
        <div className="add-plus">
          <img src={addPlusImg} alt="Add plus icon" />
        </div>
      </Link>
    </div>
  );
};

export default Nav;
