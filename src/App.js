import './App.scss';
import Home from './components/Home/Home';
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

const App = () => {
  const [expenseOpen, setExpenseOpen] = useState(false);
  const user = useSelector(state => state.user);
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

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
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
