import './Balances.scss';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { balanceCalc } from '../../helpers/balance';
import { formatMoney } from '../../helpers/money';
import Skeleton from '../Skeleton/Skeleton';
import receiveImg from '../../images/Receive.svg';
import sendImg from '../../images/Send.svg';

const Balances = ({ debts, debtsStatus, debtBalances = null }) => {
  const user = useSelector(state => state.auth.user);
  const [balances, setBalances] = useState({ total: 0, owed: 0, owe: 0 });

  useEffect(() => {
    if(debtsStatus.fetched && debtBalances) {
      setBalances(debtBalances);
    } else if (debtsStatus.fetched) {
      setBalances(balanceCalc(debts, user?.id));
    }
  }, [debts, debtsStatus, debtBalances, user])

  return (
    <div className="balance__items">
      <div className="balance__item balance__item--owed">
        <h3 className="balance__title">
          You're owed
          <img src={receiveImg} alt="Green arrow pointing bottom left" />
        </h3>
        <div className="balance__amount">
          {!debtsStatus.fetched || debtsStatus.loading ? (
            <Skeleton width="100%" height="32px" />
          ) : (
            formatMoney(balances?.owed, false)
          )}
        </div>
      </div>
      <div className="balance__item balance__item--owe">
        <h3 className="balance__title">
          You owe
          <img src={sendImg} alt="Red arrow pointing top right" />
        </h3>
        <div className="balance__amount">
          {!debtsStatus.fetched || debtsStatus.loading ? (
            <Skeleton width="100%" height="32px" />
          ) : (
            formatMoney(balances?.owe, false)
          )}
        </div>
      </div>
    </div>
  )
}

export default Balances;