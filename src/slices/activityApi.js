import { supabase } from "../supabaseClient";
import { supabaseApi } from "../api/supabaseApi";

export const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserActivities: builder.query({
      queryFn: async (userId) => {
        const { data, error } = await supabase
          .from('activity')
          .select()
          .or(`user_id.eq.${userId},related_user_id.eq.${userId}`)
          .order('created_at', { ascending: false });
        return { data, error };
      },
      providesTags: (result = [], error, arg) => [
        { type: 'Activity', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'Activity', id: id }))
      ]
    }),
    getNumberOfUserActivities: builder.query({
      queryFn: async ({ userId, count }) => {
        const { data, error } = await supabase
          .from('activity')
          .select()
          .or(`user_id.eq.${userId},related_user_id.eq.${userId}`)
          .order('created_at', { ascending: false })
          .limit(count);
        return { data, error };
      },
      providesTags: (result = [], error, arg) => [
        { type: 'Activity', id: 'LIST' },
        ...result.map(({ id }) => ({ type: 'Activity', id: id }))
      ]
    }),
    getActivity: builder.query({
      queryFn: async activityId => {
        const { data, error } = await supabase
          .from('activity')
          .select()
          .eq('id', activityId);
          return { data, error }
      },
      providesTags: (result, error, arg) => [{ type: 'Activity', id: arg }]
    }),
    getActivityByReferenceIds: builder.query({
      queryFn: async referenceIds => {
        const { data, error } = await supabase
          .from('activity')
          .select()
          .or('type.eq.EXPENSE,type.eq.DEBT')
          .in('reference_id', referenceIds);
        return { data, error };
      },
      providesTags: (result = [], error, arg) => [
        ...result.map(({ id }) => ({ type: 'Activity', id: id }))
      ]
    }),
    addActivity: builder.mutation({
      queryFn: async (newActivity) => {
        const { data, error } = await supabase
          .from('activity')
          .insert(newActivity)
          .select();
        return { data, error };
      },
      invalidatesTags: [{ type: 'Activity', id: 'LIST' }]
    }),
  })
});

export const {
  useGetUserActivitiesQuery,
  useGetNumberOfUserActivitiesQuery,
  useGetActivityQuery,
  useGetActivityByReferenceIdsQuery,
  useAddActivityMutation,
} = extendedSupabaseApi;