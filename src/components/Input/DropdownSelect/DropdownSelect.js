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
            <option key={index} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
          )
        })}
      </select>
    </div>
  )
}

export default DropdownSelect;