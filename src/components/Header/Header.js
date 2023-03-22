import './Header.scss';
import logo from '../../images/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const Header = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      dispatch(removeUser());
      if (error) throw error;
    } catch (error) {
      console.error(error);
    } finally {
      navigate('/login');
    }
  }

  return (
    <div className="header-container">
      <img src={logo} className="header-logo" alt="Dollar sign Sharepay logo" />
      <div className="header-right">
        {user ?
          <button className="button button--transparent button--small" onClick={handleLogOut}>Log Out</button> : ''}
      </div>
    </div>
  )
}

export default Header;