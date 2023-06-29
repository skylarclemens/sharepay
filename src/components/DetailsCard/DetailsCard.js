import './DetailsCard.scss';
import Avatar from '../Avatar/Avatar';
import Skeleton from '../Skeleton/Skeleton';

const DetailsCard = ({ title, subTitle, avatarUrl = null, actions, type = 'user', classes, skeleton = false, children }) => {
  return (
    <>
      <div className={`details-card-background ${classes}`}></div>
      <div className="details-card">
        <div className="details__user">
          {type !== 'expense' && <div className="details__avatar">
            <Avatar url={avatarUrl} classes="white-border white-border--thick" size={65} type={type} />
          </div>}
          {skeleton ? (
          <Skeleton height={50} width={300} />
            ) : (
          <>
            <div className="details__info-text">
              <h1 className="details__title">{title}</h1>
              {subTitle && <p className="details__subtitle">{subTitle}</p>}
            </div>
            {actions && <div className="details__actions">
              {actions}
            </div>}
          </>)}
        </div>
        {children}
      </div>
    </>
  )
}

export default DetailsCard;