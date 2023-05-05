import './Transaction.scss';
import Avatar from '../Avatar/Avatar';
import { Link } from 'react-router-dom';

const Transaction = ({ avatarUrls = [], text = '', transactionRight = null, showArrow = true, color, link = '/' }) => {
  return (
      <Link
        className="transaction-link"
        to={link}
      >
        <div className={`transaction ${
            color === 'red' ? 'transaction--red' : null
          }`}>
          <div className="transaction-avatars">
            {avatarUrls.map((url) =>
              <Avatar key={url} url={url} classes="white-border" size={40} />)}
          </div>
          <div className="desc">{text}</div>
          {transactionRight}
          {showArrow && <div className="arrow arrow--right"></div>}
        </div>
      </Link>
  );
}

export default Transaction;