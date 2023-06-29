import './Activities.scss';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import Activity from '../../components/Activity/Activity';
import { useGetNumberOfUserActivitiesQuery } from '../../slices/activityApi';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';

const Activities = () => {
  const user = useSelector(state => state.auth.user);

  /*const sortActivities = useMemo(() => {
    return createSelector(
      res => res.data,
      (data) => data?.slice(-10).sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        }) ?? []
      )
  }, []);*/

  const {
    data: activities,
    isSuccess: activitiesFetched
  } = useGetNumberOfUserActivitiesQuery({ userId: user?.id, count: 10 });

  return (
    <>
      <MainHeader
        title="Activity"
      />
      <div className="activities-container">
        <div className="activities">
          {activitiesFetched ? activities?.map((activity, index) => {
              return (
                <Activity
                  key={activity?.id}
                  userId={activity?.user_id}
                  referenceId={activity?.reference_id}
                  type={activity?.type}
                  action={activity?.action}
                  date={activity?.created_at}
                  relatedUserId={activity?.related_user_id}
                  index={index}
                  animate={true}
                />
              )
            }) : null}
        </div>
      </div>
    </>
  );
};

export default Activities;
