import './Transaction.scss';
import Avatar from '../Avatar/Avatar';
import { Link } from 'react-router-dom';

const Transaction = ({ avatarUrls = [], classes, text = '', transactionRight = null, showArrow = true, color, link = null }) => {
  return (
      <Link
        className="transaction-link"
        to={link}
      >
        <div className={`transaction ${classes} ${
            color === 'red' ? 'transaction--red' : ''
          }`}>
          <div className="transaction-avatars">
            {avatarUrls.map((url) => {
              const key = `${url}-${Math.random()}`;
              return (
                <Avatar key={key} url={url} classes="white-border" size={40} />
              )
            })}
          </div>
          <div className="desc">{text}</div>
          {transactionRight}
          {showArrow && <div className="arrow arrow--right"></div>}
        </div>
      </Link>
  );
}

export default Transaction;