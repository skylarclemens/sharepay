import './Button.scss';
import PropTypes from 'prop-types';

const Button = ({ children, type = "button", label, variant = 'primary', color, backgroundColor, borderColor, size = 'medium', disabled = false, onClick, style, className, ...props }) => {
  return (
    <button
      type={type}
      className={`button button--${variant} button--${size} ${disabled ? 'button--disabled' : ''} ${className}`}
      style={{
        color: color,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        ...style
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
  variant: PropTypes.oneOf(['primary', 'secondary', 'text', 'icon', 'custom']),
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

export default Button;