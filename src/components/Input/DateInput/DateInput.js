import './DateInput.scss';
import { useState, useRef } from 'react';
import calendarImg from '../../../images/Calendar.svg';

const DateInput = ({...props}) => {
  const dateInputRef = useRef(null);
  const [dateVal, setDateVal] = useState(new Date().toISOString().substring(0, 10));

  const openDatePicker = () => {
    dateInputRef.current.showPicker();
  }

  return (
    <div className="date-input-container" onClick={openDatePicker}>
      <div className="date-icon">
        <img src={calendarImg} alt="Calendar icon" height="18" width="18"/>
      </div>
      <input type="date" name="date" value={dateVal} placeholder="Today" ref={dateInputRef} onChange={(e) => setDateVal(e.target.value)} />
    </div>
  )
}

export default DateInput;