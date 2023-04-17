import './NewExpense.scss';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addExpense } from '../../slices/expenseSlice';
import { addDebt } from '../../slices/debtSlice';
import Header from '../../components/Header/Header';
import Avatar from '../../components/Avatar/Avatar';
import TextInput from '../../components/Input/TextInput/TextInput';
import AmountInput from '../../components/Input/AmountInput/AmountInput';
import RadioSelect from '../../components/Input/RadioSelect/RadioSelect';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const NewExpense = () => {
  const user = useSelector(state => state.user);
  const account = useSelector(state => state.account.data);
  const friends = useSelector(state => state.friends.data);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitWith, setSplitWith] = useState('');
  const [paidBy, setPaidBy] = useState(user.id);
  const [split, setSplit] = useState('');
  const [friendSelected, setFriendSelected] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({...fieldErrors, formValid: true});

    if (!handleValidation()) return;

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

    navigate(-1);
  }

  const handleValidation = () => {
    const errors = {}
    let formValid = true;

    if(!description) {
      formValid = false;
      errors.description = "Cannot be empty.";
    }
    if(!amount) {
      formValid = false;
      errors.amount = "Please enter an amount.";
    }
    if(!splitWith) {
      formValid = false;
      errors.splitWith = "Choose somebody to split the expense with.";
    }
    if(!paidBy) {
      formValid = false;
      errors.paidBy = "Select who paid the expense.";
    }
    if(!split) {
      formValid = false;
      errors.split = "Choose how you want to split the bill.";
    }

    errors.formValid = formValid;
    setFieldErrors(errors);
    return formValid;
  }

  const handleAmount = (value) => {
    const validInput = value.match(/^(\d*\.{0,1}\d{0,2}$)/);
    if (validInput) setAmount(value);
  }

  return (
    <div className="expense-container">
      <Header type="title" title="Add expense" />
        <form className="expense-form" onSubmit={handleSubmit}>
          <AmountInput name="amount" label="Amount" placeholder="0.00" fieldError={fieldErrors.amount} value={amount} onFocus={() => setFieldErrors({...fieldErrors, amount: null})} onChange={(e) => handleAmount(e.target.value)} />
          <div className="input-container">
            <TextInput className="expense-input" name="description" label="Description" value={description} placeholder="What's it for?" fieldError={fieldErrors.description} onFocus={() => setFieldErrors({...fieldErrors, description: null})} onChange={(e) => setDescription(e.target.value)} />
            <div className="split-with-container">
              <span className="input-label">Split with</span>
              <div className="split-with">
                {friends.map(friend => {
                  return (
                    <div key={friend.id} className={`split-with-friend ${splitWith === friend.id ? 'selected' : ''}`} onClick={() => {
                      setSplitWith(friend.id);
                      setFriendSelected(friend);
                      setFieldErrors({...fieldErrors, splitWith: null})
                    }}>
                      <Avatar url={friend.avatar_url} size={45} classes="white-border" />
                      {friend.name}
                    </div>  
                  )
                })}
              </div>
              {fieldErrors.splitWith && <span className="field-error-text">{fieldErrors.splitWith}</span>}
            </div>
            {friendSelected && (
              <>
                <fieldset className="expense-input">
                  <legend className="input-label">Paid By</legend>
                  <div className="expense-radio radio-paid-by">
                    <div className="user-select-option">
                      <div className={`user-detail-select ${paidBy === user.id ? 'selected' : ''}`} onClick={() => {
                        setPaidBy(user.id)
                        setFieldErrors({...fieldErrors, paidBy: null})
                      }}>
                        <Avatar url={account?.avatar_url} size={34} classes="white-border"/>
                        Me
                      </div>
                    </div>
                    <div className="user-select-option">
                      <div className={`user-detail-select ${paidBy === friendSelected.id ? 'selected' : ''}`} onClick={() => {
                        setPaidBy(friendSelected.id)
                        setFieldErrors({...fieldErrors, paidBy: null})
                      }}>
                        <Avatar url={friendSelected?.avatar_url} size={34} classes="white-border"/>
                        {friendSelected.name}
                      </div>
                    </div>
                    {fieldErrors.paidBy && <span className="field-error-text">{fieldErrors.paidBy}</span>}
                  </div>
                </fieldset>
                <RadioSelect
                  label="Split"
                  name="expense-split"
                  options={[
                    {
                      id: 'split-equally',
                      value: 'EQUALLY',
                      checked: split === 'EQUALLY',
                      content: 'Split equally'
                    },
                    {
                      id: 'full-amount',
                      value: 'FULL_AMOUNT',
                      checked: split === 'FULL_AMOUNT',
                      content: 'Owed full amount'
                    }
                  ]}
                  onFocus={() => setFieldErrors({...fieldErrors, split: null})}
                  onChange={(e) => setSplit(e.target.value)}
                  className="expense-input"
                />
              </>
            )}
            <button className="button" type="submit" alt="Create expense" title="Create expense">Create</button>
            {fieldErrors.formValid === false && <span className="field-error-text .form-validation">Please fix the errors to submit expense.</span>}
          </div>
        </form>
      </div>
  )
}

export default NewExpense;