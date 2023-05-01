import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '../supabaseClient';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  endpoints: builder => ({
    getDebts: builder.query({
      queryFn: async () => {
        const { data, error } = await supabase.from('debt').select();
        return { data, error };
      }
    })
  })
})

export const { useGetDebtsQuery } = apiSlice;