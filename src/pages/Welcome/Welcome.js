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
      <button className="button">Sign Up</button>
      <span className="login-text">Already have an account? <Link className="login-link" to="/login">Log In</Link></span>
      <div className="bottom-logo">
        <div className="outer-border"></div>
        <span className="logo-dollar">$</span>
      </div>
    </div>
  )
}

export default Welcome;