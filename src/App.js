import './App.scss';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Header from './components/Header/Header';
import Friends from './components/Friends/Friends';
import Nav from './components/Nav/Nav';
import { useState } from 'react';
import NewExpense from './components/NewExpense/NewExpense';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  const [expenseOpen, setExpenseOpen] = useState(false);

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
