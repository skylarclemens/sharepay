import { createAsyncThunk, createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';
import { supabaseApi } from '../api/supabaseApi';

const expenseAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.created_at.localeCompare(a.created_at)
});

export const extendedSupabaseApi = supabaseApi.injectEndpoints({
  endpoints: builder => ({
    getExpenses: builder.query({
      queryFn: async () => {
        const { data, error } = await supabase
          .rpc("get_user_expenses");
        return { data, error };
      },
      providesTags: (result = [], error, arg) => [
        'Expense',
        ...result.map(({ id }) => ({ type: 'Expense', id }))
      ]
    }),
    getExpense: builder.query({
      queryFn: async (expenseId) => {
        const { data, error } = await supabase
          .from('expense')
          .select()
          .eq('id', expenseId)
          .single();
        return { data, error };
      },
      providesTags: (result, error, id) => [{ type: 'Expense', id }]
    }),
    addNewExpense: builder.mutation({
      queryFn: async (newExpense) => {
        const { data, error } = await supabase
          .from('expense')
          .insert(newExpense)
          .select();
        return { data, error };
      },
      invalidatesTags: [{ type: 'Expense', id: 'LIST' }]
    }),
    updateExpense: builder.mutation({
      queryFn: async (updatedExpense) => {
        const { data, error } = await supabase
          .from('expense')
          .update(updatedExpense)
          .eq('id', updatedExpense.id)
          .select();
        return { data, error };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Expense', id: arg.id }]
    }),
    updateExpenses: builder.mutation({
      queryFn: async (updatedExpenses) => {
        const { data, error } = await supabase
          .from('expense')
          .upsert(updatedExpenses)
          .select();
        return { data, error };
      },
      invalidatesTags: ['Expense']
    })
  })
})

export const { useGetExpensesQuery,
  useGetExpenseQuery,
  useAddNewExpenseMutation,
  useUpdateExpenseMutation,
  useUpdateExpensesMutation
} = extendedSupabaseApi;

export const selectSharedExpensesByDebt = createSelector(
  res => res.data, (data, sharedDebts) => sharedDebts,
  (data, sharedDebts) => data?.filter(expense =>
    sharedDebts.find(shared => shared.expense_id === expense.id)
  ) ?? []
)

export const {
  selectAll: selectAllExpenses,
  selectById: selectExpenseById,
  selectIds: selectExpenseIds
} = expenseAdapter.getSelectors(state => state.expenses);

export const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    balances: {
      total: 0,
      owed: 0,
      owe: 0,
    }
  },
  reducers: {
    setBalances: (state, action) => {
      return {
        ...state,
        balances: action.payload,
      };
    },
  },
});

export const { setBalances } = expenseSlice.actions;
export default expenseSlice.reducer;

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async () => {
    const { data } = await supabase
      .rpc("get_user_expenses");
    return data;
  }
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (newExpense) => {
    const { data } = await supabase
      .from('expense')
      .insert(newExpense)
      .select();
    return data;
  }
)

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async (updatedExpense) => {
    const { data } = await supabase
      .from('expense')
      .upsert(updatedExpense)
      .select();
    return data;
  }
)

export const removeExpense = createAsyncThunk(
  'expenses/removeExpense',
  async (expenseId) => {
    await supabase
      .from('expense')
      .delete()
      .eq('id', expenseId);
    return expenseId;
  }
)