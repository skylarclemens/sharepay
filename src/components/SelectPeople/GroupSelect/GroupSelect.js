import Avatar from '../../Avatar/Avatar';

const GroupSelect = ({ group, handleSelect }) => {
  return (
    <button type="button" key={group.id} className="search-user search-user--group" onClick={() => handleSelect(group)}>
      <div className="user-info">
        <Avatar url={group.avatar_url} type="group" classes="white-border" size={40} />
        <div className="user-info-text">
          <div className="user-name">{group.group_name}</div>
        </div>
      </div>
      <div className="add-user-search">
        <div className="add-user-plus"></div>
      </div>
    </button>
  )
}

export default GroupSelect;