import './App.scss';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Header from './components/Header/Header';
import Friends from './components/Friends/Friends';
import Nav from './components/Nav/Nav';
import { useEffect, useState } from 'react';
import NewExpense from './components/NewExpense/NewExpense';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from './supabaseClient';
import { removeUser } from './slices/userSlice';
import { initExpenses } from './slices/expenseSlice';
import { initDebt } from './slices/debtSlice';
import { initFriends } from './slices/friendSlice';

const App = () => {
  const [expenseOpen, setExpenseOpen] = useState(false);
  const user = useSelector(state => state.user);
  const expenses = useSelector(state => state.expenses);
  const dispatch = useDispatch();

  useEffect(() => {
    const currentUserSession = async () => {
      const { error } = await supabase.auth.getUser();

      if(error) {
        console.error(error);
        dispatch(removeUser());
        return;
      }
    }
    currentUserSession();
  }, []);

  useEffect(() => {
    const getUserExpenses = async () => {
      const { data, error } = await supabase
        .from('expense')
        .select()
        .eq('payer_id', user.id);
      dispatch(initExpenses(data));
    }
    const getUserDebt = async () => {
      const { data, error } = await supabase
        .from('debt')
        .select()
        .or(`creditor_id.eq.${user.id},debtor_id.eq.${user.id}`);
      dispatch(initDebt(data));
    }
    const getUserFriends = async () => {
      try {
        const { data, error } = await supabase
          .from('user_friend')
          .select('user_id_2(*)')
          .eq('user_id_1', user.id);
        if (error) throw error;
        console.log(data);
        dispatch(initFriends(data));
      } catch (error) {
        console.error(error);
      }
    }
    if (user) {
      getUserExpenses();
      getUserDebt();
      getUserFriends();
    } 
  }, [user])

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/friends' element={<Friends />} />
      </Routes>
      <Nav setExpenseOpen={setExpenseOpen} />
      {expenseOpen ?
        <NewExpense setExpenseOpen={setExpenseOpen} /> : null}
    </>
  );
}

export default App;
