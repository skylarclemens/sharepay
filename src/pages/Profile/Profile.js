import './Profile.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from '../../components/Modal/Modal';
import PayUp from '../../components/PayUp/PayUp';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import FriendAction from '../FriendAction/FriendAction';
import TransactionsByDate from '../../components/Transactions/TransactionsByDate/TransactionsByDate';
import Balances from '../../components/Balances/Balances';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useGetSharedDebtsWithExpensesQuery } from '../../slices/debtSlice';
import { useGetAccountQuery } from '../../slices/accountSlice';
import { balanceCalc } from '../../helpers/balance';
import historyImg from '../../images/History.svg'
import Button from '../../components/UI/Buttons/Button/Button';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';

const Profile = () => {
  const user = useSelector(state => state.auth.user);
  let { id } = useParams();
  const {
    data: profileUser,
    isLoading: profileUserLoading,
    isSuccess: profileUserFetched,
  } = useGetAccountQuery(id);
  const [balances, setBalances] = useState({ total: 0, owed: 0, owe: 0 });
  const [unpaidSharedDebts, setUnpaidSharedDebts] = useState([]);
  const [paidSharedDebts, setPaidSharedDebts] = useState([]);
  const [currentExpenses, setCurrentExpenses] = useState([]);
  const [openPayUp, setOpenPayUp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const {
    data: sharedDebts,
    isLoading: debtsLoading,
    isSuccess: debtsFetched
  } = useGetSharedDebtsWithExpensesQuery({ userId: user?.id, friendId: profileUser?.id }, {
    skip: !profileUserFetched || profileUserLoading
  });

  useEffect(() => {
    if(debtsFetched && sharedDebts) {
      const unpaidDebts = sharedDebts.filter(debt => !debt.paid);
      const paidDebts = sharedDebts.filter(debt => debt.paid);
      const currentExpenses = unpaidDebts.map(debt => debt.expense);
      setBalances(balanceCalc(sharedDebts, user?.id));
      setUnpaidSharedDebts(unpaidDebts);
      setPaidSharedDebts(paidDebts);
      setCurrentExpenses(currentExpenses);
    }
  }, [sharedDebts, debtsFetched, user]);

  return (
    <>
      <MainHeader backButton={true} />
        <>
          <div className="profile">
            <DetailsCard
              title={profileUser?.name}
              subTitle={profileUser?.email}
              avatarUrl={profileUser?.avatar_url}
              skeleton={!profileUserFetched}
              actions={
              <>
                <FriendAction friend={profileUser} />
                <Button
                  className="button--pay-up"
                  title="Pay up"
                  onClick={() => setOpenPayUp(true)}>
                    Pay up
                  </Button>
              </>
            } />
            <div className="profile__section profile__section--balance">
              <h2>Balance</h2>
              <Balances debtBalances={balances} debtsStatus={{
                loading: debtsLoading,
                fetched: debtsFetched
              }} />
            </div>
            <div className="profile__section profile__section--transactions">
              <div className="section__heading">
                <h2>Transactions {showHistory ? 'History' : ''}</h2>
                <Button variant="icon" onClick={() => setShowHistory(!showHistory)}>
                  <img src={historyImg} className="history-icon" alt="History icon" />
                </Button>
              </div>
              <div className="profile__transactions">
                {!debtsFetched || debtsLoading ? (
                  <Skeleton height={52} width={329}>
                    <div className="skeleton__avatar"></div>
                  </Skeleton>) : (
                !showHistory && balances.total !== 0 &&
                  <TransactionsByDate transactions={unpaidSharedDebts} showYear={false} />)}
                {!showHistory && balances.total === 0 &&
                  <div className="medium-gray">No transactions available</div>}
                {showHistory && paidSharedDebts?.length > 0 &&
                  <TransactionsByDate transactions={paidSharedDebts} showYear={false} />}
                {showHistory && paidSharedDebts?.length === 0 &&
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
    </>
  )
}

export default Profile;