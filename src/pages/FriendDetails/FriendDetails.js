import { useSelector } from 'react-redux';
import './FriendDetails.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Avatar from '../../components/Avatar/Avatar';
import Transactions from '../../components/Transactions/Transactions';
import Header from '../../components/Header/Header';
import PayUp from '../../components/PayUp/PayUp';
import { selectFriendById } from '../../slices/friendSlice';
import { balanceCalc } from '../../helpers/balance';
import { formatMoney } from '../../helpers/money';
import { selectSharedDebts } from '../../slices/debtSlice';

const FriendDetails = () => {
  const user = useSelector(state => state.user);
  const [balances, setBalances] = useState({ total: 0, owed: 0, owe: 0 });
  const [openPayUp, setOpenPayUp] = useState(false);
  let { id } = useParams();

  const friend = useSelector(state => selectFriendById(state, id));
  const sharedDebts = useSelector(state => selectSharedDebts(state, id));

  useEffect(() => {
    setBalances(balanceCalc(sharedDebts, user.id));
  }, [sharedDebts, user]);

  const handleOpenPayUp = () => {
    setOpenPayUp(true);
  };

  let displayExpenses = null;
  if (balances.total !== 0) {
    displayExpenses = <Transactions debts={sharedDebts} friend={friend} />;
  } else {
    displayExpenses = <div className="medium-gray">No transactions available</div>;
  }

  return (
    <>
      <Header type="title" title="Friend details" />
      <div className={`friend-pay-container ${openPayUp ? 'modal-open' : ''}`}>
        <div className={openPayUp ? 'modal-overlay' : ''}></div>
        {friend && (
          <div className="friend-container">
            <div className="page-info-container">
              <div className="page-info">
                <Avatar
                  classes="white-border"
                  url={friend?.avatar_url}
                  size={50}
                />
                <h1 className="page-title">{friend?.name}</h1>
              </div>
              <div className="balance-block">
                <h3 className="balance-text">TOTAL BALANCE</h3>
                <span className="total-amount">
                  {formatMoney(balances.total)}
                </span>
              </div>
            </div>
            {!(balances.total === 0) && (
              <div className="pay-up-button">
                <button
                  type="button"
                  className="button button--border-none"
                  title="Pay up"
                  onClick={handleOpenPayUp}
                >
                  Pay up
                </button>
              </div>
            )}
            <div className="shared-expenses">
              <h2 className="heading">Shared expenses</h2>
              {displayExpenses}
            </div>
          </div>
        )}
        <PayUp
          setOpenPayUp={setOpenPayUp}
          openPayUp={openPayUp}
          friend={friend}
          sharedDebts={sharedDebts}
          balances={balances}
        />
      </div>
    </>
  );
};

export default FriendDetails;
