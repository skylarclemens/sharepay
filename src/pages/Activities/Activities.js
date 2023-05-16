import './Activities.scss';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import Activity from '../../components/Activity/Activity';
import Header from '../../components/Header/Header';
import { useGetUserActivitiesQuery } from '../../slices/activityApi';

const Activities = () => {
  const user = useSelector(state => state.auth.user);

  const sortActivities = useMemo(() => {
    return createSelector(
      res => res.data,
      (data) => data?.slice(-10).sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        }) ?? []
      )
  }, []);

  const {
    data: activities,
    isSuccess: activitiesFetched
  } = useGetUserActivitiesQuery(user?.id, {
    selectFromResult: (result) => ({
      data: sortActivities(result),
      isSuccess: result.isSuccess
    })
  });

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
                  relatedUserId={activity?.related_user_id}
                />
              )
            }) : null}
        </div>
      </div>
    </>
  );
};

export default Activities;
