import './App.scss';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Friends from './pages/Friends/Friends';
import AddFriend from './pages/AddFriend/AddFriend';
import FriendDetails from './pages/FriendDetails/FriendDetails';
import Account from './pages/Account/Account';
import Welcome from './pages/Welcome/Welcome';
import Expense from './pages/Expense/Expense';
import NewExpense from './pages/NewExpense/NewExpense';
import NewGroup from './pages/NewGroup/NewGroup';
import Group from './pages/Group/Group';
import Recent from './pages/Recent/Recent';
import Header from './components/Header/Header';
import Nav from './components/Nav/Nav';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from './supabaseClient';
import { removeUser } from './slices/userSlice';

const App = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const currentUserSession = async () => {
      const { error } = await supabase.auth.getUser();

      if (error) {
        dispatch(removeUser());
        return;
      }
    };
    currentUserSession();
  }, [dispatch]);

  return (
    <>
      {user && <Header type="main" />}
      <div className="container">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Welcome />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/recent" element={<Recent />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/add-friend" element={<AddFriend />} />
          <Route path="/group/:id" element={<Group />} />
          <Route path="/new-group" element={<NewGroup />} />
          <Route path="/friend/:id" element={<FriendDetails />} />
          <Route path="/expense/:id" element={<Expense />} />
          <Route path="/new-expense" element={<NewExpense />} />
        </Routes>
      </div>
      {user && <Nav />}
    </>
  );
};

export default App;
