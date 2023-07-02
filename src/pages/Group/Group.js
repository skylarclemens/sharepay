import './Group.scss';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetGroupMembersQuery, useGetGroupQuery } from '../../slices/groupSlice';
import { useGetSharedGroupDebtsWithExpensesQuery } from '../../slices/debtSlice';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import Balances from '../../components/Balances/Balances';
import Skeleton from '../../components/Skeleton/Skeleton';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';
import TransactionsByDate from '../../components/Transactions/TransactionsByDate/TransactionsByDate';
import Button from '../../components/UI/Buttons/Button/Button';
import historyImg from '../../images/History.svg';
import Modal from '../../components/Modal/Modal';
import NewGroup from '../NewGroup/NewGroup';
import Icon from '../../components/Icons/Icon';

const Group = () => {
  const { id } = useParams();
  const user = useSelector(state => state.auth.user);

  const [unpaidSharedDebts, setUnpaidSharedDebts] = useState([]);
  const [paidSharedDebts, setPaidSharedDebts] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [openGroupEdit, setOpenGroupEdit] = useState(false);

  const {
    data: group,
    isSuccess: groupFetched
   } = useGetGroupQuery(id);

  const {
    data: sharedDebts,
    isLoading: debtsLoading,
    isSuccess: debtsFetched
  } = useGetSharedGroupDebtsWithExpensesQuery({ userId: user?.id, groupId: id }, {
    skip: !id
  });

  const {
    data: groupMembers,
  } = useGetGroupMembersQuery(id, {
    skip: !id
  });

  useEffect(() => {
    if(debtsFetched && sharedDebts) {
      const unpaidDebts = sharedDebts.filter(debt => !debt.paid);
      const paidDebts = sharedDebts.filter(debt => debt.paid);
      setUnpaidSharedDebts(unpaidDebts);
      setPaidSharedDebts(paidDebts);
    }
  }, [sharedDebts, debtsFetched, user]);

  return (
      <>
      <MainHeader
        backButton={true}
        right={
          <Button
            variant="icon"
            onClick={() => setOpenGroupEdit(true)}
          >
            <Icon name="EDIT" />
          </Button>
        }
      />
      <div className="group-container">
        <DetailsCard 
          title={group?.group_name}
          avatarUrl={group?.avatar_url}
          skeleton={!groupFetched}
          type="group" />
        <div className="group__section group__section--balance">
          <h2>Balance</h2>
          <Balances debts={sharedDebts} debtsStatus={{
            loading: debtsLoading,
            fetched: debtsFetched
          }} />
        </div>
        <div className="group__section group__section--transactions">
          <div className="section__heading">
            <h2>Transactions {showHistory ? 'History' : ''}</h2>
            <Button variant="icon" onClick={() => setShowHistory(!showHistory)}>
              <img src={historyImg} className="history-icon" alt="History icon" />
            </Button>
          </div>
          <div className="group__transactions">
            {!debtsFetched || debtsLoading ? (
              <Skeleton width="100%" height="56px" />
            ) : (
            !showHistory && unpaidSharedDebts?.length > 0 && 
              <TransactionsByDate transactions={unpaidSharedDebts} showYear={false} />)}
            {!showHistory && unpaidSharedDebts?.length === 0 && (
              <div className="medium-gray">No group expenses available</div>
            )}
            {showHistory && paidSharedDebts?.length > 0 &&
              <TransactionsByDate transactions={paidSharedDebts} showYear={false} />}
            {showHistory && paidSharedDebts?.length === 0 && (
              <div className="medium-gray">No group expenses available</div>
            )}
          </div>
        </div>
      </div>
      <Modal open={openGroupEdit}>
        <NewGroup modify={true} groupData={group} members={groupMembers} setOpen={setOpenGroupEdit} />
      </Modal>
    </>
  );
};

export default Group;
