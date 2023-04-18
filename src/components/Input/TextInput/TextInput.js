import './TextInput.scss';

const TextInput = ({ name, label, fieldError, onFocus, onChange, placeholder, value, className }) => {
  return (
    <div className={`text-input-container ${className}`}>
      <label className="input-label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type="text" placeholder={placeholder} className={`text-input ${fieldError && 'field-error'}`} value={value} onFocus={onFocus} onChange={onChange} />
      {fieldError && <span className="field-error-text">{fieldError}</span>}
    </div>
  )
}

export default TextInput;