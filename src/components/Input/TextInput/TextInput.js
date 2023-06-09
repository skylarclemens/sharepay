import './TextInput.scss';
import { forwardRef } from 'react';

const TextInput = forwardRef(
  (
    {
      name,
      label,
      fieldError,
      onFocus,
      onChange,
      placeholder,
      value,
      size,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`text-input-container ${className}`}>
        <label className="input-label" htmlFor={name}>
          {label}
        </label>
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          size={size}
          className={`text-input ${fieldError ? 'field-error' : ''}`}
          ref={ref}
          value={value}
          onFocus={onFocus}
          onChange={onChange}
          onClick={() => ref?.current?.focus()}
          {...props}
        />
        {fieldError && <span className="field-error-text">{fieldError}</span>}
      </div>
    );
  }
);

export default TextInput;
