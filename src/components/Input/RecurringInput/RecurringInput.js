import './RecurringInput.scss';
import recurringImg from '../../../images/Recurring.svg';

const RecurringInput = ({ recurringVal, setRecurringVal }) => {
  const handleRecurring = () => {
    const recurringOptions = ['Once', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
    const currentRecurringIndex = recurringOptions.indexOf(recurringVal);
    const nextRecurringIndex = (currentRecurringIndex + 1) % recurringOptions.length;
    setRecurringVal(recurringOptions[nextRecurringIndex]);
  }

  return (
    <div className="recurring" onClick={
      () => handleRecurring()
    }>
      <img src={recurringImg} alt="Recurring icon" height="18" width="18"/>
      <div className="recurring-select">
        {recurringVal}
      </div>
    </div>
  )
}

export default RecurringInput