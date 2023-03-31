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
import { fetchExpenses } from './slices/expenseSlice';
import { fetchDebts } from './slices/debtSlice';
import { fetchFriends } from './slices/friendSlice';

const App = () => {
  const [expenseOpen, setExpenseOpen] = useState(false);
  const user = useSelector(state => state.user);
  const expensesStatus = useSelector(state => state.expenses.status);
  const debtsStatus = useSelector(state => state.debts.status);
  const friendsStatus = useSelector(state => state.friends.status);
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
    if (debtsStatus === 'idle') {
      dispatch(fetchDebts(user.id));
    }
  }, [debtsStatus, dispatch]);

  useEffect(() => {
    if (expensesStatus === 'idle') {
      dispatch(fetchExpenses(user.id));
    }
  }, [expensesStatus, dispatch])

  useEffect(() => {
    if (friendsStatus === 'idle') {
      dispatch(fetchExpenses(user.id));
    }
  }, [friendsStatus, dispatch]);

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
