import './SimpleTransaction.scss';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../../constants/categories';
import Icon from '../../Icons/Icon';

const SimpleTransaction = ({ description, to, date, amount, category, transactionType = 'owed', users, ...props }) => {
  const iconName = category || 'GENERAL';
  return (
    <Link to={to} className="simple-transaction" {...props}>
      <div className="simple-transaction__left">
        <div className="simple-transaction__icon" style={{
          background: CATEGORIES[category]?.color || '#6A9B5D',
        }}>
          <Icon name={iconName} width="100%" height="20px" />
        </div>
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