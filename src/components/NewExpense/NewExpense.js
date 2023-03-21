import './NewExpense.scss';
import { useState } from 'react';

const NewExpense = ({ setExpenseOpen }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [split, setSplit] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      description: description,
      amount: amount,
      split: split
    }
  }
  
  const handleRadio = (e) => {
    setSplit(e.target.value);
  }

  return (
    <div className="expense-container">
      <div className="expense-header">
        <button type="button" className="back-arrow" title="Back button" alt="Back button" onClick={() => setExpenseOpen(false)}></button>
        <span className="header-text">Add expense</span>
      </div>
      <div className="expense-info">
        <form className="expense-form" onSubmit={handleSubmit}>
          <div className="expense-input">
            <label className="input-label" htmlFor="description">Description</label>
            <input id="description" name="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="expense-input">
            <label className="input-label" htmlFor="amount">Amount</label>
            <input id="amount" name="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <fieldset>
            <legend className="input-label">Split</legend>
            <div className="split-radio">
              <div className="radio-option">
                <label>
                  <input id="me-split-equally" name="expense-split" type="radio" value="me-split-equally" checked={split === 'me-split-equally'} onChange={handleRadio} />
                  Paid by me, split equally
                </label>
              </div>
              <div className="radio-option">
                <label>
                  <input id="them-split-equally" name="expense-split" type="radio" value="them-split-equally" checked={split === 'them-split-equally'} onChange={handleRadio} />
                  Paid by them, split equally
                </label>
              </div>
              <div className="radio-option">
                <label>
                  <input id="me-owed" name="expense-split" type="radio" value="me-owed" checked={split === 'me-owed'} onChange={handleRadio} />
                  I am owed full amount
                </label>
              </div>
              <div className="radio-option">
                <label>
                  <input id="them-owe" name="expense-split" type="radio" value="them-owe" checked={split === 'them-owe'} onChange={handleRadio} />
                  They are owed full amount
                </label>
              </div>
            </div>
          </fieldset>
          <button className="button" type="submit" alt="Create expense" title="Create expense">Create</button>
        </form>
      </div>
    </div>
  )
}

export default NewExpense;