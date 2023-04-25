import { Outlet } from 'react-router-dom';

const EmptyLayout = ({ children }) => {
  return (
    <div className="empty-layout">
      { children ? children : <Outlet /> }
    </div>
  )
}

export default EmptyLayout;