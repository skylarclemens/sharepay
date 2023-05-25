import './DropdownSelect.scss';

const DropdownSelect = ({ options, onChange, classes }) => {
  return (
    <div className={`dropdown-select ${classes}`}>
      <select name="dropdown-select" id="dropdown-select" onChange={onChange}>
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