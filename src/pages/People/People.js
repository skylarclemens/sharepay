import './People.scss';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Tabs from '../../components/Tabs/Tabs';
import groupImg from '../../images/Group_white.svg';
import friendImg from '../../images/Friend.svg';

const People = () => {
  const [selected, setSelected] = useState('left');
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/')[2];
    if (path === 'groups') {
      setSelected('right');
    } else {
      setSelected('left');
    }
  }, [location]);

  return (
      <>
        <Tabs
          leftTab={
            <Link className="people-tab" to="/people/friends">
              <img src={friendImg} alt="Friends Icon" />
              <span>Friends</span>
            </Link>
          }
          rightTab={
            <Link className="people-tab" to="/people/groups">
              <img src={groupImg} alt="Groups Icon" />
              <span>Groups</span>
            </Link>
          } 
          selected={selected}
          setSelected={setSelected}
        />
        <div className="people-container">
          <Outlet />
        </div>
      </>
  );
}

export default People;