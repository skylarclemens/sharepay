import './Home.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from '../Dashboard/Dashboard';
import { fetchAccount } from '../../slices/accountSlice';
import MainLayout from '../../layouts/MainLayout/MainLayout';

const Home = () => {
  const { user } = useSelector(state => state.auth);
  const account = useSelector(state => state.account);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && account.status === 'idle') {
      dispatch(fetchAccount(user?.id));
    }
  }, [user, account, dispatch]);

  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
};

export default Home;
