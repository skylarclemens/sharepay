import './NewExpense.scss';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addExpense } from '../../slices/expenseSlice';

const NewExpense = ({ setExpenseOpen }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [split, setSplit] = useState('');
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const [user1Details, user2Details] = transaction(amount, paidBy, split);

    const newExpense = {
      id: window.crypto.randomUUID(),
      description: description,
      amount: amount,
      user1: {
        id: user.id,
        ...user1Details
      },
      user2: {
        id: 0,
        ...user2Details
      }
    }
    dispatch(addExpense(newExpense));
    setExpenseOpen(false);
  }

  const transaction = (amount, paidBy, split) => {
    let user1Type = paidBy === 'ME' ? 'OWED' : 'OWE';
    let user2Type = paidBy === 'ME' ? 'OWE' : 'OWED';
    const payAmount = split === 'EQUALLY' ? amount/2 : amount;

    return [
      {
        amount: payAmount,
        type: user1Type
      },
      {
        amount: payAmount,
        type: user2Type
      }
    ]
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
            <legend className="input-label">Paid By</legend>
            <div className="expense-radio">
              <div className="radio-option">
                <label>
                  <input id="me-split-equally" name="paid-by" type="radio" value="ME" checked={paidBy === 'ME'} onChange={(e) => setPaidBy(e.target.value)} />
                  Me
                </label>
              </div>
              <div className="radio-option">
                <label>
                  <input id="them-split-equally" name="paid-by" type="radio" value="THEM" checked={paidBy === 'THEM'} onChange={(e) => setPaidBy(e.target.value)} />
                  Them
                </label>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend className="input-label">Split</legend>
            <div className="expense-radio">
              <div className="radio-option">
                <label>
                  <input id="split-equally" name="expense-split" type="radio" value="EQUALLY" checked={split === 'EQUALLY'} onChange={(e) => setSplit(e.target.value)} />
                  Split equally
                </label>
              </div>
              <div className="radio-option">
                <label>
                  <input id="them-split-equally" name="expense-split" type="radio" value="FULL_AMOUNT" checked={split === 'FULL_AMOUNT'} onChange={(e) => setSplit(e.target.value)} />
                  Owed full amount
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