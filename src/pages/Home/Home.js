import './Home.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dashboard from '../Dashboard/Dashboard';
import { fetchAccount } from '../../slices/accountSlice';
import MainLayout from '../../layouts/MainLayout/MainLayout';
import EmptyLayout from '../../layouts/EmptyLayout/EmptyLayout';
import Welcome from '../Welcome/Welcome';

const Home = () => {
  const user = useSelector(state => state.user);
  const account = useSelector(state => state.account);
  const dispatch = useDispatch();

  /*useEffect(() => {
    const currentUserSession = async () => {
      const { error } = await supabase.auth.getUser();

      if (error) {
        dispatch(removeUser());
        return;
      }
    };
    currentUserSession();
  }, [dispatch]);*/

  useEffect(() => {
    if (user && account.status === 'idle') {
      dispatch(fetchAccount(user?.id));
    }
  }, [user, account, dispatch]);

  return (
    <>
      {user ? (
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
