import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Friends from './pages/Friends/Friends';
import AddFriend from './pages/AddFriend/AddFriend';
import FriendDetails from './pages/FriendDetails/FriendDetails';
import Account from './pages/Account/Account';
import Expense from './pages/Expense/Expense';
import NewExpense from './pages/NewExpense/NewExpense';
import NewGroup from './pages/NewGroup/NewGroup';
import Group from './pages/Group/Group';
import Recent from './pages/Recent/Recent';
import MainLayout from './layouts/MainLayout/MainLayout';
import DetailsLayout from './layouts/DetailsLayout/DetailsLayout';
import FormLayout from './layouts/FormLayout/FormLayout';
import EmptyLayout from './layouts/EmptyLayout/EmptyLayout';
import App from './App';

const RoutesContainer = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route element={<MainLayout />}>
            <Route path="account" element={<Account />} />
            <Route path="recent" element={<Recent />} />
            <Route path="friends" element={<Friends />} />
          </Route>
          <Route element={<DetailsLayout />}>
            <Route path="expense/:id" element={<Expense />} />
            <Route path="friend/:id" element={<FriendDetails />} />
            <Route path="group/:id" element={<Group />} />
          </Route>
          <Route element={<FormLayout />}>
            <Route path="new-expense" element={<NewExpense />} />
            <Route path="add-friend" element={<AddFriend />} />
            <Route path="new-group" element={<NewGroup />} />
          </Route>
          <Route element={<EmptyLayout />}>
            <Route path="signup" element={<SignUp />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default RoutesContainer;