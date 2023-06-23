import './Welcome.scss';
import { Link } from 'react-router-dom';
import logo from '../../images/Logo.svg';

const Welcome = () => {
  return (
    <div className="empty-layout">
      <div className="welcome-container">
        <img src={logo} alt="Celery logo" />
        <div className="welcome-text-container">
          <div className="welcome-text">Welcome to</div>
          <div className="welcome-title">Celery</div>
        </div>
        <div className="slides-container">

        </div>
        <div className="welcome-buttons">
          <Link
            className="link-button button button--primary button--medium"
            to="/signup"
          >
            Sign Up
          </Link>
          <Link
            className="link-button button button--secondary button--medium"
            to="/login"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
