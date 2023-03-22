import './Login.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { setUser } from '../../slices/userSlice';

const Login = () => {
  const user = useSelector(state => state.user);
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      dispatch(setUser(data.user));

      if (error) throw error
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="log-in">
      {loading ? 'Logging up...' :
        (<>
          <form className="log-in-form" onSubmit={handleLogin}>
            <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button className="button" type="submit">Log In</button>
          </form>
          <div>
            Need an account? <Link to="/signup">Sign up</Link>
          </div>
        </>
      )}
    </div>
  )
}

export default Login;