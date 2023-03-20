import './App.scss';
import Dashboard from './components/Dashboard/Dashboard';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './slices/userSlice';

const App = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  return (
    <>
      <Dashboard />
    </>
  );
}

export default App;
