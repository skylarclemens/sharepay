import { Outlet } from 'react-router-dom';
import Nav from '../../components/Nav/Nav';

const DetailsLayout = ({ children }) => {
  return (
    <div className="details layout">
      { children ? children : <Outlet /> }
      <Nav />
    </div>
  )
}

export default DetailsLayout;