import './Login.scss';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { setCredentials } from '../../slices/authSlice';
import Button from '../../components/UI/Buttons/Button/Button';
import TextInput from '../../components/Input/TextInput/TextInput';
import logo from '../../images/Logo.svg';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      dispatch(setCredentials(data));
      if (error) throw error;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Celery logo" />
      <form className="log-in-form form-container" onSubmit={handleLogin}>
        <h1 className="login-heading">Log In</h1>
        <div className="input-container">
          <label className="input-label" htmlFor="email">
            Email
          </label>
          <TextInput
            type="email"
            name="email"
            id="email"
            value={email}
            className="form-text-input"
            onChange={e => setEmail(e.target.value)}
            />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="password">
            Password
          </label>
          <TextInput
            type="password"
            name="password"
            id="password"
            value={password}
            className="form-text-input"
            onChange={e => setPassword(e.target.value)}
            />
        </div>
        <div className="action-container">
          <Button
            style={{width: '100%'}}
            type="submit"
          >
            {loading ? 'Logging In...' : 'Log In'}
          </Button>
          <span className="login-bottom-text">
            Need an account?{' '}
            <Link className="login-bottom-link" to="/signup">
              Sign up
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
