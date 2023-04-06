import './Login.scss';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { setUser } from '../../slices/userSlice';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      navigate('/');
    }
  }

  return (
    <div className="log-in">
      <form className="log-in-form form-container" onSubmit={handleLogin}>
        <h1>Log In</h1>
        <div className="input-container">
          <label className="input-label" htmlFor="email">Email</label>
          <input className="text-input" type="email" name="email" id="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="password">Password</label>
          <input className="text-input" type="password" name="password" id="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="action-container">
          <button className="button button--medium button--border-none button--box-shadow" type="submit">{loading ? 'Logging In...' : 'Log In'}</button>
          <span className="login-bottom-text">
          Need an account? <Link className="login-bottom-link" to="/signup">Sign up</Link>
          </span>
        </div>
      </form>
    </div>
  )
}

export default Login;