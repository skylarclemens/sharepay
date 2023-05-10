import Avatar from '../../Avatar/Avatar';

const GroupSelect = ({ group, handleSelect }) => {
  return (
    <div key={group.id} className="search-user search-user--group">
      <div className="user-info">
        <Avatar url={group.avatar_url} type="group" classes="white-border" size={40} />
        <div className="user-info-text">
          <div className="user-name">{group.group_name}</div>
        </div>
      </div>
      <button
        type="button"
        className="add-user-search"
        onClick={() => handleSelect(group)}
      >
        <div className="add-user-plus"></div>
      </button>
    </div>
  )
}

export default GroupSelect;