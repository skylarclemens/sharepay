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

  debtFetched && console.log('debt', debt);

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
              {accountFetched && currentUser ? 'You ' :
                accountFetched && `${account?.name} `}
            </span>
            <span className="activity__action">
              {action === 'CREATE' && 'added a new'}
              {action === 'UPDATE' && `updated a${type === 'EXPENSE' && 'n'}`}
              {action === 'DELETE' && `deleted a${type === 'EXPENSE' && 'n'}`}
              {action === 'PAY' && 'paid a'}
              {` ${type?.toLowerCase()}`}
            </span>
          </div>
        </div>
        <div className="activity__right">
          {type === 'EXPENSE' && expenseFetched && expense?.amount ? (
            <div className="activity__amount">
              <span>${expense?.amount.toFixed(2)}</span>
            </div>
          ) : null}
          {type === 'DEBT' && debtFetched && debt?.amount ? (
            <div className="activity__amount">
              <span>${debt?.amount.toFixed(2)}</span>
            </div>
          ) : null}
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