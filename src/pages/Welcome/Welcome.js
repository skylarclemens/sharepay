import './Welcome.scss';
import { Link } from 'react-router-dom';
import receipt from '../../images/Receipt.svg';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <img src={receipt} alt="Receipt icon" />
      <div className="welcome-text-container">
        <div className="welcome-text">Welcome to</div>
        <div className="welcome-title">Sharepay</div>
      </div>
      <Link
        className="link-button button button--medium button--border-none button--box-shadow"
        to="/login"
      >
        Log In
      </Link>
      <span className="login-bottom-text">
        Need an account?{' '}
        <Link className="login-bottom-link" to="/signup">
          Sign Up
        </Link>
      </span>
      <div className="bottom-logo">
        <div className="outer-border"></div>
        <span className="logo-dollar">$</span>
      </div>
    </div>
  );
};

export default Welcome;
