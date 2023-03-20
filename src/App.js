import './App.scss';
import Dashboard from './components/Dashboard/Dashboard';
import SignUp from './components/SignUp/SignUp';
import Header from './components/Header/Header';
import { useSelector, useDispatch } from 'react-redux';

const App = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  return (
    <>
      <Header />
      {user ?
        <Dashboard /> :
        <SignUp />
      }
    </>
  );
}

export default App;
