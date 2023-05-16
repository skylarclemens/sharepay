
import './Profile.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import Modal from '../../components/Modal/Modal';
import PayUp from '../../components/PayUp/PayUp';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import FriendAction from '../FriendAction/FriendAction';
import Transactions from '../../components/Transactions/Transactions';
import Balances from '../../components/Balances/Balances';
import { useGetDebtsQuery, selectSharedDebtsByFriendId } from '../../slices/debtSlice';
import { useGetExpensesQuery, selectSharedExpensesByDebt } from '../../slices/expenseSlice';
import { useGetAccountQuery } from '../../slices/accountSlice';
import { balanceCalc } from '../../helpers/balance';

const Profile = () => {
  const user = useSelector(state => state.auth.user);
  let { id } = useParams();
  const {
    data: profileUser,
    isSuccess: profileUserFetched,
  } = useGetAccountQuery(id);
  const [balances, setBalances] = useState({ total: 0, owed: 0, owe: 0 });
  const [openPayUp, setOpenPayUp] = useState(false);

  const { sharedDebts,
    isLoading: debtsLoading,
    isSuccess: debtsFetched } = useGetDebtsQuery(user?.id, {
    selectFromResult: (result) => ({
      ...result,
      sharedDebts: selectSharedDebtsByFriendId(result, id)
    })
  });

  const { currentExpenses } = useGetExpensesQuery(undefined, {
    skip: !debtsFetched,
    selectFromResult: (result) => ({
      ...result,
      currentExpenses: selectSharedExpensesByDebt(result, sharedDebts)
    })
  })

  useEffect(() => {
    setBalances(balanceCalc(sharedDebts, user.id));
  }, [sharedDebts, user]);

  return (
    <>
      <Header type="title"/>
      {profileUserFetched && (
        <>
          <div className="profile">
            <DetailsCard
              title={profileUser?.name}
              subTitle={profileUser?.email}
              avatarUrl={profileUser?.avatar_url}
              actions={
              <>
                <FriendAction friend={profileUser} />
                <button
                  type="button"
                  className="button button--medium button--border-none button--flat"
                  title="Pay up"
                  onClick={() => setOpenPayUp(true)}>
                    Pay up
                  </button>
              </>
            } />
            <div className="profile__section profile__section--balance">
              <h2>Balance</h2>
              <Balances debts={sharedDebts} debtsStatus={{
                loading: debtsLoading,
                fetched: debtsFetched
              }} />
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
          <Modal open={openPayUp}>
            <PayUp
              setOpenPayUp={setOpenPayUp}
              expenses={currentExpenses}
              sharedDebts={sharedDebts}
              recipient={profileUser}
            />
          </Modal>
        </>
      )}
    </>
  )
}

export default Profile;