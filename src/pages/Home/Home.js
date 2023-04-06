import './Home.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from '../Dashboard/Dashboard';
import { fetchAccount } from '../../slices/accountSlice';

const Home = () => {
  const user = useSelector(state => state.user);
  const accountStatus = useSelector(state => state.account.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && accountStatus === 'idle') {
      dispatch(fetchAccount(user.id));
    }
  }, [accountStatus, user, dispatch]);

  return (
    <>
      <Dashboard />
    </>
  )
}

export default Home;