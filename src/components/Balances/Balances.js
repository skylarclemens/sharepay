import './Balances.scss';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';
import { formatMoney } from '../../helpers/money';
import Skeleton from '../Skeleton/Skeleton';
import receiveImg from '../../images/Receive.svg';
import sendImg from '../../images/Send.svg';

const Balances = ({ debts, debtsStatus }) => {
  const user = useSelector(state => state.auth.user);
  const [balances, setBalances] = useState({ total: 0, owed: 0, owe: 0 });

  useEffect(() => {
    if(debtsStatus.fetched) {
      setBalances(balanceCalc(debts, user.id));
    }
  }, [debts, debtsStatus, user])

  return (
    <div className="balance__items">
      <div className="balance__item balance__item--owed">
        <h3 className="balance__title">
          You're owed
          <img src={receiveImg} alt="Green arrow pointing bottom left" />
        </h3>
        <p className="balance__amount">
          {!debtsStatus.fetched || debtsStatus.loading ? (
            <Skeleton width="100%" height="32px" />
          ) : (
            formatMoney(balances?.owed, false)
          )}
        </p>
      </div>
      <div className="balance__item balance__item--owe">
        <h3 className="balance__title">
          You owe
          <img src={sendImg} alt="Red arrow pointing top right" />
        </h3>
        <p className="balance__amount">
          {!debtsStatus.fetched || debtsStatus.loading ? (
            <Skeleton width="100%" height="32px" />
          ) : (
            formatMoney(balances?.owe, false)
          )}
        </p>
      </div>
    </div>
  )
}

export default Balances;