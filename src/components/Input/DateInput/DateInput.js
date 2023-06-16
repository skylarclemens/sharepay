import './DateInput.scss';
import { useRef } from 'react';
import calendarImg from '../../../images/Calendar.svg';

const DateInput = ({ date, onChange }) => {
  const dateInputRef = useRef(null);

  const openDatePicker = () => {
    dateInputRef.current.showPicker();
  }

  return (
    <div className="date-input-container" onClick={openDatePicker}>
      <div className="date-icon">
        <img src={calendarImg} alt="Calendar icon" height="18" width="18"/>
      </div>
      <input type="date" name="date" value={date} placeholder="Today" ref={dateInputRef} onChange={onChange} />
    </div>
  )
}

export default DateInput;