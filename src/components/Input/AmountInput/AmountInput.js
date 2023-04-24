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
}) => {
  return (
    <div className="amount-input-container">
      <label className="input-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        size={value.length > 3 ? value.length + 1 : 4}
        maxLength={12}
        inputMode="decimal"
        pattern={pattern}
        placeholder={placeholder}
        className={`amount-input ${fieldError && 'field-error'}`}
        value={value}
        onFocus={onFocus}
        onChange={onChange}
      />
      {fieldError && <span className="field-error-text">{fieldError}</span>}
    </div>
  );
};

export default AmountInput;
