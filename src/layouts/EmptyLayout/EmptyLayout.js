import { Outlet } from 'react-router-dom';
import './EmptyLayout.scss';

const EmptyLayout = ({ children }) => {
  return (
    <>
      { children ? children : <Outlet /> }
    </>
  )
}

export default EmptyLayout;