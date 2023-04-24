import './UserButton.scss';
import Avatar from '../../Avatar/Avatar';

const UserButton = ({
  variant,
  selected,
  user,
  name,
  avatarSize,
  className,
  onClick,
}) => {
  return (
    <div
      className={
        `user-button ${variant || 'light-gray'} ${
          selected ? 'selected' : ''
        } ` + (className || '')
      }
      onClick={onClick}
    >
      <Avatar
        url={user.avatar_url}
        size={avatarSize || 45}
        classes="white-border"
      />
      {name || user.name}
    </div>
  );
};

export default UserButton;
