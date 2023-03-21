import './App.scss';
import Dashboard from './components/Dashboard/Dashboard';
import SignUp from './components/SignUp/SignUp';
import Header from './components/Header/Header';
import Nav from './components/Nav/Nav';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import NewExpense from './components/NewExpense/NewExpense';

const App = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [expenseOpen, setExpenseOpen] = useState(false);

  return (
    <>
      <Header />
      {user ?
        <Dashboard /> :
        <SignUp />
      }
      <Nav setExpenseOpen={setExpenseOpen} />
      {expenseOpen ?
        <NewExpense setExpenseOpen={setExpenseOpen} /> : null}
    </>
  );
}

export default App;
