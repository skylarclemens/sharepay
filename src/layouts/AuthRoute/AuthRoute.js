import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthRoute = () => {
  const session = useSelector(state => state.auth.session);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }
  return <Outlet />;
}

export default AuthRoute;