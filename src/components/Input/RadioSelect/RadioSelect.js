import './RadioSelect.scss';

const RadioSelect = ({ label, name, options, onFocus, onChange, fieldError, className }) => {
  return (
    <fieldset className={className}>
      <legend className="input-label">{label}</legend>
      <div className="radio-select">
        {options.map(option => {
          return (
            <div key={option.id} className="radio-option">
              <input id={option.id} name={name} className="radio-option-input" type="radio" value={option.value} checked={option.checked} onFocus={onFocus} onChange={onChange} />
              <label className={`radio-option-select ${option.checked ? 'selected' : ''}`} htmlFor={option.id}>{option.content}</label>
            </div>
          )
        })}
        {fieldError && <span className="field-error-text">{fieldError}</span>}
      </div>
    </fieldset>
  )
}

export default RadioSelect;