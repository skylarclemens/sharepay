import { supabase } from "../supabaseClient";
import { supabaseApi } from "../api/supabaseApi";

const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getPaidUps: builder.query({
      queryFn: async () => {
        const { data, error } = await supabase
          .from('paid_up')
          .select('*, creditor_id(*), debtor_id(*)');
        return { data, error }
      },
      providesTags: [{ type: 'PaidUp', id: 'LIST' }]
    })
  })
})

export const {
  useGetPaidUpsQuery
} = extendedSupabaseApi