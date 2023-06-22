import './Header.scss';
import PropTypes from 'prop-types';

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

Header.propTypes = {
  /**
   * What type of header is this?
   */
  type: PropTypes.oneOf(['main', 'title']),
  /**
   * What color is the header?
   */
  backgroundColor: PropTypes.string,
}

export default Header;

/*          {backButton ? (
            <Button
              title="Back button"
              alt="Back button"
              className="arrow-container--back-arrow"
              onClick={leftFn || (() => navigate(-1))}>
                <div className="arrow arrow--left arrow--back-arrow arrow--white"></div>
              </Button>
          ) : left ? (*/