import { supabase } from "../supabaseClient";

export const getCurrentGroups = async (userId) => {
  const { data } = await supabase
    .from('user_group')
    .select('group!inner(*)')
    .eq('user_id', userId);
  return data;
}

export const getAllGroupsUsers = async (groupId) => {
  const { data } = await supabase
    .from('user_group')
    .select('users!inner(*)')
    .eq('group_id', groupId);
  return data.map(obj => obj.users);
}