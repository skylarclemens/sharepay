import { Outlet } from 'react-router-dom';
import './SecondaryLayout.scss';

const SecondaryLayout = ({ children }) => {
  return (
    <div className="secondary container">
     { children ? children : <Outlet /> }
    </div>
  )
}

export default SecondaryLayout;