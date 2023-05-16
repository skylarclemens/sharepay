import './Activity.scss';
import { useGetPaidUpsQuery } from '../../slices/paidApi';
import { useGetUserActivitiesQuery } from '../../slices/activityApi';
import { useSelector } from 'react-redux';
import { CREATE, PAY, PAID_UP } from '../../constants/activity';
import Transaction from '../../components/Transaction/Transaction';
import Result from '../../components/Result/Result';
import Header from '../../components/Header/Header';

const Activity = () => {
  const user = useSelector(state => state.auth.user);
  const {
    data: paidUps,
    isSuccess: paidUpsFetched
  } = useGetPaidUpsQuery();
  const {
    data: activities,
    isSuccess: activitiesFetched
  } = useGetUserActivitiesQuery(user?.id);

  const paidText = (debtor, creditor, date) => (
    <div className="paid-info">
      <div className="paid-text">
        <span>{debtor.name}</span>
        paid
        <span>{creditor.name}</span>
      </div>
      <div className="paid-date">
        {new Date(date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </div>
    </div>
  )

  const transactionRight = (
    <div className="debt-paid">
      PAID UP
    </div>
  )
  

  return (
    <>
    <Header type="main" title="Activity" />
    <div className="activities">
      {activitiesFetched ? activities?.map((activity) => {
        const text = `${activity?.user_id === user?.id && 'You'} created a new ${activity?.type.toLowerCase()}`
          return (
            <Result
              key={activity.id}
              resultLeft={activity.action === 'CREATE' && (
                <>
                  
                </>
              )}
              resultRight={activity.amount && (
                <>
                  ${activity.amount.toFixed(2)}
                </>
              )}
              resultBottom={activity.created_at && (
                <>
                  {new Date(activity.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </>
              )}
              text={text}
            />
          )}) : 'Loading...'}
    </div>
    <div className="recent">
      {paidUpsFetched && paidUps.map((paidUp) => {
        return (
          <div className="paid-up" key={paidUp.id}>
            <Transaction
              avatarUrls={[
                paidUp.creditor_id?.avatar_url,
                paidUp.debtor_id?.avatar_url
              ]}
              text={paidText(paidUp.debtor_id, paidUp.creditor_id, paidUp.created_at)}
              transactionRight={transactionRight}
              showArrow={false}
            />
            
          </div>
        )
      })}
    </div>
    </>
  );
};

export default Activity;
