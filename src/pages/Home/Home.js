import './Home.scss';
import Dashboard from '../Dashboard/Dashboard';
import MainLayout from '../../layouts/MainLayout/MainLayout';

const Home = () => {
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
};

export default Home;
