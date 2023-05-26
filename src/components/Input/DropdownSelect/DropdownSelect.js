import './DropdownSelect.scss';

const DropdownSelect = ({ options, name, onChange, classes }) => {
  return (
    <div className={`dropdown-select ${classes}`}>
      <select name={name}
        id={name}
        onChange={onChange}
        title={name}>
        {options.map((option, index) => {
          return (
            <option key={'option-' + index} value={option.value}>{option.text}</option>
          )
        })}
      </select>
    </div>
  )
}

export default DropdownSelect;