import './DetailsCard.scss';
import Avatar from '../Avatar/Avatar';

const DetailsCard = ({ title, subTitle, avatarUrl = null, actions, type = 'user', classes }) => {
  return (
    <>
      <div className={`details-card-background ${classes}`}></div>
      <div className="details-card">
        <div className="details__user">
          {type !== 'expense' && <div className="details__avatar">
            <Avatar url={avatarUrl} classes="white-border white-border--thick" size={65} type={type} />
          </div>}
          <div className="details__info-text">
            <h1 className="details__name">{title}</h1>
            {subTitle && <p className="details__username">{subTitle}</p>}
          </div>
          {actions && <div className="details__actions">
            {actions}
          </div>}
        </div>
      </div>
    </>
  )
}

export default DetailsCard;