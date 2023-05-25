import './AmountInput.scss';

const AmountInput = ({
  name,
  label,
  fieldError,
  onFocus,
  onChange,
  placeholder,
  pattern,
  value,
  classes,
}) => {
  return (
    <div className={`amount-container ${classes}`}>
      <label className="input-label" htmlFor={name}>
        {label}
      </label>
      <div className={`amount-input-container input-icon ${fieldError && 'field-error'}`}>
        <span className="currency-symbol">$</span>
        <input
          id={name}
          name={name}
          size={value.length > 0 ? value.length + 1 : 4}
          maxLength={5}
          inputMode="decimal"
          pattern={pattern}
          placeholder={placeholder}
          className="amount-input"
          value={value}
          onFocus={onFocus}
          onChange={onChange}
        />
      </div>
      {fieldError && <span className="field-error-text">{fieldError}</span>}
    </div>
  );
};

export default AmountInput;
