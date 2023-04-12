import './PayUp.scss';
import Avatar from '../Avatar/Avatar';
import { useSelector } from 'react-redux';

const PayUp = ({ setOpenPayUp, openPayUp, friend, sharedExpenses, balances }) => {
  const account = useSelector(state => state.account);

  const payType = balances.total > 0 ? 'OWED' : 'OWE';

  const handlePayButton = () => {
    setOpenPayUp(false);
  }

  const handlePayCancel = () => {
    setOpenPayUp(false);
  }

  return (
    openPayUp && (
      <div className="modal-container">
        <div className="pay-up-container">
          <div className="expense-avatars">
            <Avatar url={account.data.avatar_url} size={65} />
            <Avatar url={friend.avatar_url} size={65} />
          </div>
          <div className="balance-block balance-block--total">
            <div>
              {payType === 'OWE' ? (
                <>Pay <span className="friend-name">{friend.name}</span></>
              ) : (
                <><span className="friend-name">{friend.name}</span> paid you</>
              )}
            </div>
            <span className="total">${Math.abs(balances.total.toFixed(2)) || 0.00}</span>
          </div>
          <button type="button" className="button" title="Pay up" onClick={handlePayButton}>
            {payType === 'OWE' ? 'Pay' : 'Paid up'}
          </button>
          <button type="button" className="button button--white button--small" title="Cancel" onClick={handlePayCancel}>
            Cancel
          </button>
        </div>
      </div>
    )
  )
}

export default PayUp;