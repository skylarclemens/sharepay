import './Header.scss';

const Header = ({ type, title, color, backgroundColor, left, center, right, className, ...props }) => {
  return (
    <div className={`header-container ${className}`}
      style={{
        backgroundColor: backgroundColor,
        color: color,
      }}
      {...props}>
      <div className={`header header--${type}`}>
        <div className="header-left">
          {left}
        </div>
        <div className="header-center">
          {center}
        </div>
        <div className="header-right">
          {right}
        </div>
      </div>
    </div>
  )
}

export default Header;