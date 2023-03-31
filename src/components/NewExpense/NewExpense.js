import './NewExpense.scss';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addExpense } from '../../slices/expenseSlice';
import { addDebt } from '../../slices/debtSlice';
import Select from 'react-select';
import { supabase } from '../../supabaseClient';

const NewExpense = ({ setExpenseOpen }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitWith, setSplitWith] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [split, setSplit] = useState('');
  const [options, setOptions] = useState([]);
  const user = useSelector(state => state.user);
  const friends = useSelector(state => state.friends.data);
  const dispatch = useDispatch();

  useEffect(() => {
    const friendOptions = friends.map((friend) => {
      const friendId = friend.id;
      const friendName = friend.name;
      return (
        {
          value: friendId,
          label: friendName
        }
      )
    });
    setOptions(friendOptions);
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    let expenseData;
    const newExpense = {
      payer_id: paidBy,
      description: description,
      amount: amount
    }

    try {
      const { data, error } = await supabase
        .from('expense')
        .insert(newExpense)
        .select();
      expenseData = data[0];
      if (error) throw error;
      dispatch(addExpense(expenseData));
    } catch (error) {
      console.error(error);
    }

    const debtAmount = split === 'EQUALLY' ? amount/2 : amount;
    const debtor = paidBy === user.id ? splitWith : user.id;
    const newDebt = {
      creditor_id: paidBy,
      debtor_id: debtor,
      amount: debtAmount,
      expense_id: expenseData.id
    }

    try {
      const { data, error } = await supabase
        .from('debt')
        .insert(newDebt)
        .select();
      if (error) throw error;

      dispatch(addDebt(data[0]));
    } catch (error) {
      console.error(error);
    }

    setExpenseOpen(false);
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
          <div className="expense-input">
            <span className="input-label">Split between</span>
            <Select options={options} onChange={(opt) => setSplitWith(opt.value)}/>
          </div>
          <fieldset>
            <legend className="input-label">Paid By</legend>
            <div className="expense-radio">
              <div className="radio-option">
                <label>
                  <input id="me-split-equally" name="paid-by" type="radio" value={user.id} checked={paidBy === user.id} onChange={(e) => setPaidBy(e.target.value)} />
                  Me
                </label>
              </div>
              <div className="radio-option">
                <label>
                  <input id="them-split-equally" name="paid-by" type="radio" value={splitWith} checked={paidBy === splitWith} onChange={(e) => setPaidBy(e.target.value)} />
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