
import './Profile.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import FriendAction from '../FriendAction/FriendAction';
import Transactions from '../../components/Transactions/Transactions';
import { useGetDebtsQuery, selectSharedDebtsByFriendId } from '../../slices/debtSlice';
import { useGetAccountQuery } from '../../slices/accountSlice';
import { balanceCalc } from '../../helpers/balance';
import { formatMoney } from '../../helpers/money';
import receiveImg from '../../images/Receive.svg';
import sendImg from '../../images/Send.svg';

const Profile = () => {
  const user = useSelector(state => state.auth.user);
  let { id } = useParams();
  const {
    data: profileUser,
    isSuccess: profileUserFetched,
  } = useGetAccountQuery(id);
  const [balances, setBalances] = useState({ total: 0, owed: 0, owe: 0 });

  const { sharedDebts,
    isLoading: debtsLoading,
    isSuccess: debtsFetched } = useGetDebtsQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      sharedDebts: selectSharedDebtsByFriendId(result, id)
    })
  })

  useEffect(() => {
    setBalances(balanceCalc(sharedDebts, user.id));
  }, [sharedDebts, user]);

  return (
    <>
      <Header type="title"/>
      {profileUserFetched && (
        <div className="profile">
          <DetailsCard user={profileUser} actions={
            <>
            <div className="details__actions--left">
              <FriendAction friend={profileUser} />
              <button className="button button--small button--border-none button--flat">Add expense</button>
            </div>
            <button className="button button--small button--border-none button--flat">Pay up</button>
            </>
          } />
          <div className="profile__section profile__section--balance">
            <h2>Balance</h2>
            <div className="balance__items">
              <div className="balance__item balance__item--owed">
                <h3 className="balance__title">
                  You're owed
                  <img src={receiveImg} alt="Green arrow pointing bottom left" />
                </h3>
                <p className="balance__amount">{formatMoney(balances?.owed, false)}</p>
              </div>
              <div className="balance__item balance__item--owe">
                <h3 className="balance__title">
                  You owe
                  <img src={sendImg} alt="Red arrow pointing top right" />
                </h3>
                <p className="balance__amount">{formatMoney(balances?.owe, false)}</p>
            </div>
            </div>
          </div>
          <div className="profile__section profile__section--transactions">
            <h2>Transactions</h2>
            <div className="profile__transactions">
              {debtsLoading &&
                <div className="medium-gray">Loading...</div>}
              {debtsFetched && balances.total !== 0 &&
                <Transactions transactions={sharedDebts} type="debt" />}
              {balances.total === 0 &&
                <div className="medium-gray">No transactions available</div>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile;