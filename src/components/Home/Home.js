import './Home.scss';
import { useSelector } from 'react-redux';
import Dashboard from '../Dashboard/Dashboard';

const Home = () => {
  const user = useSelector(state => state.user);

  return (
    <>
      {user ? <Dashboard /> : null}
    </>
  )
}

export default Home;