import './Transaction.scss';
import Avatar from '../Avatar/Avatar';
import { Link } from 'react-router-dom';

const Transaction = ({ avatarUrls = [], text = '', transactionRight = null, showArrow = true, color, link = null }) => {
  return (
      <Link
        className="transaction-link"
        to={link}
      >
        <div className={`transaction ${
            color === 'red' ? 'transaction--red' : null
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