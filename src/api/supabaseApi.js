import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
//import { supabase } from '../supabaseClient';

export const supabaseApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Expense', 'Debt', 'Friend'],
  endpoints: () => ({})
});