import './Activity.scss';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAccountQuery } from '../../slices/accountSlice';
import { useGetExpenseQuery } from '../../slices/expenseSlice';
import { useGetDebtQuery } from '../../slices/debtSlice';
import { useGetGroupQuery } from '../../slices/groupSlice';
import Avatar from '../Avatar/Avatar';
import successImg from '../../images/Success-white-border.svg';
import { Link } from 'react-router-dom';

const Activity = ({ userId, referenceId, type, action, date, relatedUserId = null }) => {
  const [activityDescription, setActivityDescription] = useState('');
  const [activityLink, setActivityLink] = useState('');
  const [activityAmount, setActivityAmount] = useState('');
  const [activityName, setActivityName] = useState('');
  const [activityRelatedName, setActivityRelatedName] = useState('');
  const user = useSelector(state => state.auth.user);
  const {
    data: account,
    isSuccess: accountFetched
  } = useGetAccountQuery(userId);
  const {
    data: relatedAccount,
  } = useGetAccountQuery(relatedUserId, {
    skip: !relatedUserId
  });
  const {
    data: expense,
  } = useGetExpenseQuery(referenceId, {
    skip: type !== 'EXPENSE'
  });
  const {
    data: debt,
    isSuccess: debtFetched
  } = useGetDebtQuery(referenceId, {
    skip: type !== 'DEBT'
  });
  const {
    data: debtExpense,
  } = useGetExpenseQuery(debt?.expense_id, {
    skip: type !== 'DEBT' && !debtFetched
  });
  const {
    data: group,
  } = useGetGroupQuery(referenceId, {
    skip: type !== 'GROUP'
  });

  const currentUser = user?.id === userId;
  const currentRelatedUser = user?.id === relatedUserId;

  const userName = currentUser ? 'You' : account?.name;
  const relatedName = currentRelatedUser ? 'you' : relatedAccount?.name;

  const expensePaid = action === 'PAY' && type === 'EXPENSE';

  useEffect(() => {
    const getDescription = (type, action) => {
      switch (type) {
        case 'EXPENSE':
          switch (action) {
            case 'CREATE':
              setActivityName(userName);
              setActivityDescription(` created a new expense`);
              setActivityLink(`/expense/${referenceId}`);
              setActivityAmount(expense?.amount);
              break;
            case 'UPDATE':
              setActivityName(userName);
              setActivityDescription(` updated an expense`);
              setActivityLink(`/expense/${referenceId}`);
              break;
            case 'DELETE':
              setActivityName(userName);
              setActivityDescription(` deleted an expense`);
              break;
            case 'PAY':
              setActivityName(expense?.description ? expense?.description : 'Deleted');
              setActivityDescription(' completely paid up');
              setActivityLink(`/expense/${referenceId}`);
              setActivityAmount(expense?.amount);
              break;
            default:
              break;
          }
          break;
        case 'DEBT':
          switch (action) {
            case 'SETTLE':
              setActivityName(userName);
              setActivityRelatedName(relatedName);
              setActivityDescription(` settled with `);
              setActivityLink(`/expense/${debtExpense?.id}`);
              setActivityAmount(debt?.amount);
              break;
            case 'PAY':
              setActivityName(userName);
              setActivityRelatedName(relatedName);
              setActivityDescription(` paid `);
              setActivityLink(`/expense/${debtExpense?.id}`);
              setActivityAmount(debt?.amount);
              break;
            default:
              break;
          }
          break;
        case 'GROUP':
          switch (action) {
            case 'CREATE':
              setActivityName(userName);
              setActivityRelatedName(group?.name);
              setActivityDescription(` created the group `);
              setActivityLink(`/group/${referenceId}`);
              break;
            case 'UPDATE':
              setActivityDescription(` updated the group `);
              setActivityLink(`/group/${referenceId}`);
              break;
            case 'DELETE':
              setActivityName(userName);
              setActivityRelatedName(group?.name);
              setActivityDescription(` deleted the group `);
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    }

    getDescription(type, action);
  }, [type, action, userName, relatedName, expense, debt, debtExpense, group, referenceId, userId, relatedUserId])

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
      <Link to={activityLink} className="activity__link">
        <div className="activity__main">
          <div className="activity__left">
            {accountFetched && !expensePaid && (
              <Avatar url={account?.avatar_url} size={38} classes="white-border activity__avatar" />
            )}
            {expensePaid && (
              <div className="activity__avatar">
                <img className="activity__avatar--success" height="38" width="38" src={successImg} alt="success" />
              </div>
            )}
            <div className="activity__text">
              <span className="activity__name">
                {activityName}
              </span>
              <span className="activity__action">
                {activityDescription}
              </span>
              {activityRelatedName && (
                <span className="activity__name">
                  {activityRelatedName}
                </span>)}
            </div>
          </div>
          <div className="activity__right">
            {activityAmount && (
              <div className="activity__amount">
                <span>${activityAmount.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
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