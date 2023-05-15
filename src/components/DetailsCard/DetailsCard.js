import './DetailsCard.scss';
import Avatar from '../Avatar/Avatar';

const DetailsCard = ({ title, subTitle, avatarUrl = null, actions, type = 'user', classes }) => {
  return (
    <>
      <div className={`details-card-background ${classes}`}></div>
      <div className="details-card">
        <div className="details__user">
          <div className="details__avatar">
            {type !== 'expense' && <Avatar url={avatarUrl} classes="white-border white-border--thick" size={65} type={type} />}
          </div>
          <div className="details__info-text">
            <h1 className="details__name">{title}</h1>
            {type === 'user' && <p className="details__username">{subTitle}</p>}
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