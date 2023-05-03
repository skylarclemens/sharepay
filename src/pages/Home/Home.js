import './Home.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from '../Dashboard/Dashboard';
import { fetchAccount } from '../../slices/accountSlice';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import EmptyLayout from '../../layouts/EmptyLayout/EmptyLayout';
import Welcome from '../Welcome/Welcome';

const Home = () => {
  const auth = useSelector(state => state.auth);
  const account = useSelector(state => state.account);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.user && account.status === 'idle') {
      dispatch(fetchAccount(auth.user?.id));
    }
  }, [auth.user, account, dispatch]);

  return (
    <>
      {auth.session ? (
        <MainLayout>
          <Dashboard />
        </MainLayout>
      ) : (
        <EmptyLayout>
          <Welcome />
        </EmptyLayout>
      )}
    </>
  );
};

export default Home;
