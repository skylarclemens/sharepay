import { useSelector } from 'react-redux';
import './FriendDetails.scss';
import { useParams } from 'react-router-dom';
import Avatar from '../../components/Avatar/Avatar';

const FriendDetails = () => {
  const friends = useSelector(state => state.friends.data);
  const debts = useSelector(state => state.debts.data);
  let { id } = useParams();

  const sharedExpenses = debts.filter(debt => debt.creditor_id === id || debt.debtor_id === id);
  const friend = friends.find(friend => friend.id === id);

  return (
    <>
      {friend &&
        <div className="friend-container">
          <div className="friend-info">
            <Avatar url={friend.avatar_url} size={60} />
            <div className="friend-info-text">
              <h1>{friend.name}</h1>
              <span className="medium-gray">{friend.email}</span>
            </div>
          </div>
          <div className="shared-expenses">
            <h2>Shared expenses</h2>
            {sharedExpenses.map((debt) => {
              return (
                <div key={debt.id} className="expense">
                  {debt.amount}
                </div>
              )
            })}
          </div>
        </div>}
    </>
  )
}

export default FriendDetails;