import { supabase } from "../supabaseClient";
import { supabaseApi } from "../api/supabaseApi";

const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getPayments: builder.query({
      queryFn: async (userId) => {
        const { data, error } = await supabase
          .from('payment')
          .select('*, creditor_id(*), debtor_id(*)')
          .or(`recipient_id.eq.${userId},payer_id.eq.${userId}`);
        return { data, error }
      },
      providesTags: [{ type: 'Payment', id: 'LIST' }]
    }),
    addPayments: builder.mutation({
      queryFn: async (newPayments) => {
        const { data, error } = await supabase
          .from('payment')
          .insert(newPayments)
          .select();
        return { data, error };
      },
      invalidatesTags: [{ type: 'Payment', id: 'LIST' }]
    })
  })
})

export const {
  useGetPaymentsQuery,
  useAddPaymentsMutation,
} = extendedSupabaseApi