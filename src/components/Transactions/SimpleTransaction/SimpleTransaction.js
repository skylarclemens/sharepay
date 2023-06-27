import './SimpleTransaction.scss';
import { Link } from 'react-router-dom';

const SimpleTransaction = ({ description, to, date, amount, category, transactionType = 'owed', ...props }) => {
  return (
    <Link to={to} className="simple-transaction" {...props}>
      <div className="simple-transaction__left">
        <div className="simple-transaction__icon"></div>
        <div className="simple-transaction__desc">
          <div className="simple-transaction__desc--top">
            {description}
          </div>
          <div className="simple-transaction__desc--bottom simple-transaction__date">
            {date}
          </div>
        </div>
      </div>
      <div className="simple-transaction__right">
        <span className={`simple-transaction__amount amount--${transactionType}`}>
          {amount}
        </span>
      </div>
    </Link>
  )
}

export default SimpleTransaction;