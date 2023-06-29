import Button from "../../components/UI/Buttons/Button/Button"
import { Link, useNavigate } from "react-router-dom"
import { userLogout } from '../../slices/authSlice';
import { supabaseApi } from '../../api/supabaseApi';
import { useDispatch } from 'react-redux';
import { supabase } from "../../supabaseClient";

const AccountMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(supabaseApi.util.resetApiState());
      dispatch(userLogout());
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="account-menu-container">
      <ul className="account-menu">
        <li>
          <Link to="edit-profile"
            className="button--menu"
          >
            Edit Profile
            <div className="arrow arrow--right"></div>
          </Link>
        </li>
      </ul>
      <Button
        variant="secondary"
        onClick={handleLogOut}
        className="log-out-button"
      >
        Log Out
      </Button>
    </div>
  )
}

export default AccountMenu;