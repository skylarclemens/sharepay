import './NewExpense.scss';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addExpense } from '../../slices/expenseSlice';
import { addDebt } from '../../slices/debtSlice';
import Select from 'react-select';
import Header from '../../components/Header/Header';
import Avatar from '../../components/Avatar/Avatar';
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
  const [options, setOptions] = useState([]);
  const [friendSelected, setFriendSelected] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  }, [friends]);

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

  const handleFriendSelect = (value) => {
    const friendSplit = friends.find(friend => friend.id === value);
    setFriendSelected(friendSplit);
  }

  return (
    <div className="expense-container">
      <Header type="title" title="Add expense" />
      <div className="expense-info">
        <form className="expense-form" onSubmit={handleSubmit}>
          <div className="expense-input">
            <label className="input-label" htmlFor="description">Description</label>
            <input id="description" name="description" type="text" className={`text-input ${fieldErrors.description && 'field-error'}`} value={description} onFocus={() => setFieldErrors({...fieldErrors, description: null})} onChange={(e) => setDescription(e.target.value)} />
            {fieldErrors.description && <span className="field-error-text">{fieldErrors.description}</span>}
          </div>
          <div className="expense-input">
            <label className="input-label" htmlFor="amount">Amount</label>
            <input id="amount" name="amount" type="number" className={`text-input ${fieldErrors.amount && 'field-error'}`} value={amount} onFocus={() => setFieldErrors({...fieldErrors, amount: null})} onChange={(e) => setAmount(e.target.value)} />
            {fieldErrors.amount && <span className="field-error-text">{fieldErrors.amount}</span>}
          </div>
          <div className="expense-input">
            <span className="input-label">Split between</span>
            <Select options={options} onFocus={() => setFieldErrors({...fieldErrors, splitWith: null})} onChange={(opt) => {
              setSplitWith(opt.value)
              handleFriendSelect(opt.value)
            }}/>
            {fieldErrors.splitWith && <span className="field-error-text">{fieldErrors.splitWith}</span>}
          </div>
          {friendSelected && (
            <>
              <fieldset>
                <legend className="input-label">Paid By</legend>
                <div className="expense-radio radio-paid-by">
                  <div className="radio-option">
                    <div className={`user-detail-select ${paidBy === user.id ? 'selected' : ''}`} onClick={() => {
                      setPaidBy(user.id)
                      setFieldErrors({...fieldErrors, paidBy: null})
                    }}>
                      <Avatar url={account?.avatar_url} size={34} classes="white-border"/>
                      Me
                    </div>
                  </div>
                  <div className="radio-option">
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
              <fieldset>
                <legend className="input-label">Split</legend>
                <div className="expense-radio">
                  <div className="radio-option">
                    <label>
                      <input id="split-equally" name="expense-split" type="radio" value="EQUALLY" checked={split === 'EQUALLY'} onFocus={() => setFieldErrors({...fieldErrors, split: null})} onChange={(e) => setSplit(e.target.value)} />
                      Split equally
                    </label>
                  </div>
                  <div className="radio-option">
                    <label>
                      <input id="them-split-equally" name="expense-split" type="radio" value="FULL_AMOUNT" checked={split === 'FULL_AMOUNT'} onFocus={() => setFieldErrors({...fieldErrors, split: null})} onChange={(e) => setSplit(e.target.value)} />
                      Owed full amount
                    </label>
                  </div>
                  {fieldErrors.split && <span className="field-error-text split-field">{fieldErrors.split}</span>}
                </div>
              </fieldset>
            </>
          )}
          <button className="button" type="submit" alt="Create expense" title="Create expense">Create</button>
          {fieldErrors.formValid === false && <span className="field-error-text .form-validation">Please fix the errors to submit expense.</span>}
        </form>
      </div>
    </div>
  )
}

export default NewExpense;