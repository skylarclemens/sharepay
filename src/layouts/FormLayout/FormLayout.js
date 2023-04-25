import { Outlet } from 'react-router-dom';

const FormLayout = ({ children }) => {
  return (
    <div className="form layout">
      { children ? children : <Outlet /> }
    </div>
  )
}

export default FormLayout;