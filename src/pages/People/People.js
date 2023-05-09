import './People.scss';
import { useState } from 'react';
import Tabs from '../../components/Tabs/Tabs';
import Friends from '../../pages/Friends/Friends';
import Groups from '../../pages/Groups/Groups';
import groupImg from '../../images/Group_white.svg';
import friendImg from '../../images/Friend.svg';

const People = () => {
  const [selected, setSelected] = useState('left');
  return (
      <>
        <Tabs
          leftTab={
            <>
              <img src={friendImg} alt="Friends Icon" />
              <span>Friends</span>
            </>
          }
          rightTab={
            <>
              <img src={groupImg} alt="Groups Icon" />
              <span>Groups</span>
            </>
          } 
          selected={selected}
          setSelected={setSelected}
        />
        <div className="people-container">
          {selected === 'left' ? (
            <div className="friends">
              <Friends />
            </div>
          ) : (
            <div className="groups">
              <Groups />
            </div>
          )}
        </div>
      </>
  );
}

export default People;