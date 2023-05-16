import { supabase } from "../supabaseClient";
import { supabaseApi } from "../api/supabaseApi";

export const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserActivities: builder.query({
      queryFn: async (userId) => {
        const { data, error } = await supabase
          .from('activity')
          .select()
          .eq('user_id', userId);
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
    addNewActivity: builder.mutation({
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
  useGetActivityQuery,
  useAddNewActivityMutation,
} = extendedSupabaseApi;