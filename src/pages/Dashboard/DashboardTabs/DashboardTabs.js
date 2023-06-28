import './DashboardTabs.scss';
import Skeleton from '../../../components/Skeleton/Skeleton';
import All from './All';
import Owed from './Owed';
import Owe from './Owe';

const DashboardTabs = ({ currentTab, debts, debtsLoaded, user, ...props }) => {
    return (
      <>
        <h2 className="main-heading">Transactions</h2>
        <div className="recent-transactions">
          {!debtsLoaded && <Skeleton width="100%" height="56px"><div className="skeleton__avatar"></div></Skeleton>}
          {debtsLoaded && (
            currentTab === 'all' ? (
              <All debts={debts} user={user} />
            ) : currentTab === 'owed' ? (
              <Owed debts={debts} user={user} />
            ) : currentTab === 'owe' ? (
              <Owe debts={debts} user={user} />
            ) : null)}
        </div>
      </>
    )
}

export default DashboardTabs;