import './DetailsCard.scss';
import Avatar from '../Avatar/Avatar';

const DetailsCard = ({ user, actions }) => {
  return (
    <>
      <div className="details-card-background"></div>
      <div className="details-card">
        <div className="details__user">
          <div className="details__avatar">
            <Avatar url={user?.avatar_url} classes="white-border" size={65} />
          </div>
          <div className="details__info-text">
            <h1 className="details__name">{user?.name}</h1>
            <p className="details__username">{user?.email}</p>
          </div>
          <div className="details__actions">
            {actions}
          </div>
        </div>
      </div>
    </>
  )
}

export default DetailsCard;