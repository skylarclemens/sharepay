import './Button.scss';

const Button = ({ children, variant, onClick, className }) => {
  return (
    <button
      className={`button ${className}`}
      varaint={variant}
      onClick={onClick}>
      {children}
    </button>
  )
}

export default Button;