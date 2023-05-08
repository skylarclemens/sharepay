import './Groups.scss';
import Header from '../../components/Header/Header';
import { useGetGroupsQuery } from '../../slices/groupSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import addGroupImg from '../../images/Add_group.svg';

const Groups = () => {
  const user = useSelector(state => state.auth.user);

  const {
    data: groups,
    isSuccess: groupsSuccess
  } = useGetGroupsQuery(user?.id);

  return (
    <>
      <Header
        type="main"
        headerRight={
          <Link to="/new-group">
            <img src={addGroupImg} alt="Add Group Icon" />
          </Link>
        } />
      <div className="groups-container">
        {groupsSuccess && groups?.length > 0
          ? groups?.map(group => {
              return (
                <Link
                  to={`/group/${group?.id}`}
                  key={group?.id}
                  className="group"
                >
                  <span>{group?.group_name}</span>
                  <div className="arrow arrow--right"></div>
                </Link>
              );
            })
          : null}
        {groups?.length === 0 && (
          <div className="no-people">
            <span>Create a group by tapping the</span>
            <div className="add-people-img">
              <img className="add-people-icon" src={addGroupImg} alt="Add Group Icon" />
            </div>
            <span>icon above.</span>
          </div>
        )}
      </div>
    </>
  )
}

export default Groups;