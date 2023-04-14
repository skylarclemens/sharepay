import { supabase } from "../supabaseClient";

const getAll = async () => {
  const { data } = await supabase
    .from('expense')
    .select()
    .eq('payer_id', user.id);
    return data;
}

const getExpenseById = async (id) => {
  const { data } = await supabase
    .from('expense')
    .select()
    .eq('id', id);
    return data;
}

const getPaidExpenses = async (id) => {
  const { data } = await supabase
    .from('expense')
    .select()
    .eq('paid', true);
    return data;
}

export default { getAll, getExpenseById, getPaidExpenses };