import './Activities.scss';
import { useGetPaidUpsQuery } from '../../slices/paidApi';
import { useGetUserActivitiesQuery } from '../../slices/activityApi';
import { useSelector } from 'react-redux';
import Transaction from '../../components/Transaction/Transaction';
import Activity from '../../components/Activity/Activity';
import Header from '../../components/Header/Header';

const Activities = () => {
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
      <div className="activities-container">
        <div className="activities">
          {activitiesFetched ? activities?.map((activity) => {
              return (
                <Activity
                  key={activity?.id}
                  userId={activity?.user_id}
                  referenceId={activity?.reference_id}
                  type={activity?.type}
                  action={activity?.action}
                  date={activity?.created_at}
                />
              )
            }) : null}
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
        </div>
      </div>
    </>
  );
};

export default Activities;
