import './NewExpense.scss';
import { useState } from 'react';

const NewExpense = ({ setExpenseOpen }) => {
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState(null);
  const [split, setSplit] = useState(null);

  return (
    <div className="expense-container">
      <div className="expense-header">
        <button type="button" className="back-arrow" title="Back button" alt="Back button" onClick={() => setExpenseOpen(false)}></button>
        <span className="header-text">Add expense</span>
      </div>
    </div>
  )
}

export default NewExpense;