import { supabase } from "../supabaseClient";

const getAll = async () => {
  const { data } = await supabase
    .from('expense')
    .select()
    .eq('payer_id', user.id);
    return data;
}

export default { getAll };