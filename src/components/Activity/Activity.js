import './Activity.scss';
import { useSelector } from 'react-redux';
import { useGetAccountQuery } from '../../slices/accountSlice';
import { useGetExpenseQuery } from '../../slices/expenseSlice';
import { useGetDebtQuery } from '../../slices/debtSlice';
import Avatar from '../Avatar/Avatar';

const Activity = ({ userId, referenceId, type, action, date }) => {
  const user = useSelector(state => state.auth.user);
  const {
    data: account,
    isSuccess: accountFetched
  } = useGetAccountQuery(userId);
  const currentUser = user?.id === userId;

  const {
    data: expense,
    isSuccess: expenseFetched
  } = useGetExpenseQuery(referenceId, {
    skip: type !== 'EXPENSE'
  });

  const {
    data: debt,
    isSuccess: debtFetched
  } = useGetDebtQuery(referenceId, {
    skip: type !== 'DEBT'
  });

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div className="activity">
      <div className="activity__main">
        <div className="activity__left">
          {accountFetched && (
            <Avatar url={account?.avatar_url} size={40} classes="white-border activity__avatar" />
          )}
          <div className="activity__text">
            <span className="activity__name">
              {accountFetched && `${account?.name} `}
            </span>
            <span className="activity__action">
              {action === 'CREATE' && 'added a new'}
              {action === 'UPDATE' && 'updated a'}
              {action === 'DELETE' && 'deleted a'}
              {type === 'EXPENSE' && ' expense'}
              {type === 'DEBT' && ' debt'}
            </span>
          </div>
        </div>
        <div className="activity__right">
          <div className="activity__amount">
            {type === 'EXPENSE' && expenseFetched && (
              <span>${expense?.amount.toFixed(2)}</span>
            )}
            {type === 'DEBT' && debtFetched && (
              <span>${debt?.amount.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="activity__bottom">
        <span className="activity__date">
          {formattedDate} 
        </span>
        {' '}
        <span className="activity__time">
          {formattedTime}
        </span>
      </div>
    </div>
  )
}

export default Activity;