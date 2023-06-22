import './Button.scss';
import PropTypes from 'prop-types';

const Button = ({ children, label, variant, color, backgroundColor, size, disabled, onClick, className, ...props }) => {
  return (
    <button
      className={`button ${className} button--${variant} button--${size} button--${disabled ? 'disabled' : ''}`}
      style={{
        color: color,
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
      }}
      variant={variant}
      color={color}
      disabled={disabled}
      onClick={onClick}
      {...props}>
        {label}
        {children}
    </button>
  )
}

Button.propTypes = {
  /**
   * What type of button is this?
   */
  variant: PropTypes.oneOf(['primary', 'secondary', 'text']),
  /**
   * What text should the button display?
   */
  label: PropTypes.string,
  /**
   * What color font is the button?
   */
  color: PropTypes.string,
  /**
   * What is the background color of the button?
   */
  backgroundColor: PropTypes.string,
  /**
   * What size should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium']),
  /**
   * Is the button disabled?
   */
  disabled: PropTypes.bool,
  /**
   * Click handler
   */
  onClick: PropTypes.func,
}

Button.defaultProps = {
  variant: 'primary',
  color: null,
  backgroundColor: null,
  size: 'medium',
  disabled: false,
  onClick: null,
}

export default Button;