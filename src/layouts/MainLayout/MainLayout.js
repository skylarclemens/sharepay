import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Nav from '../../components/Nav/Nav';

const MainLayout = ({ children }) => {
  return (
    <div className="layout">
      {children ? children : <Outlet />}
      <Nav />
    </div>
  )
}

export default MainLayout;