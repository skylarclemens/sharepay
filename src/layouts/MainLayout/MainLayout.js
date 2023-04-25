import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Nav from '../../components/Nav/Nav';
import './MainLayout.scss';

const MainLayout = ({ children }) => {
  return (
    <div className="layout container">
      <Header type="main" />
        {children ? children : <Outlet />}
      <Nav />
    </div>
  )
}

export default MainLayout;