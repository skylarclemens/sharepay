import './Header.scss';
import logo from '../../images/logo.png'

const Header = () => {
  return (
    <div className="header-container">
      <img src={logo} className="header-logo" alt="Dollar sign Sharepay logo" />
      <div className="header-right">

      </div>
    </div>
  )
}

export default Header;