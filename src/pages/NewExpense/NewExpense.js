import './NewExpense.scss';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addExpense } from '../../slices/expenseSlice';
import { addDebt } from '../../slices/debtSlice';
import Header from '../../components/Header/Header';
import TextInput from '../../components/Input/TextInput/TextInput';
import AmountInput from '../../components/Input/AmountInput/AmountInput';
import RadioSelect from '../../components/Input/RadioSelect/RadioSelect';
import UserButton from '../../components/User/UserButton/UserButton';
import Modal from '../../components/Modal/Modal';
import SelectFriends from '../../components/SelectFriends/SelectFriends';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const NewExpense = () => {
  const user = useSelector(state => state.user);
  const account = useSelector(state => state.account.data);
  const friends = useSelector(state => state.friends.data);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitWith, setSplitWith] = useState([{ ...account }]);
  const [paidBy, setPaidBy] = useState(user.id);
  const [split, setSplit] = useState('');
  const [friendSelected, setFriendSelected] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [openSelectFriends, setOpenSelectFriends] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setFieldErrors({ ...fieldErrors, formValid: true });

    if (!handleValidation()) return;

    let expenseData;
    const newExpense = {
      payer_id: paidBy,
      description: description,
      amount: amount,
    };

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

    const debtAmount = split === 'EQUALLY' ? amount / 2 : amount;
    const debtor = paidBy === user.id ? splitWith : user.id;
    const newDebt = {
      creditor_id: paidBy,
      debtor_id: debtor,
      amount: debtAmount,
      expense_id: expenseData.id,
    };

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
  };

  const handleValidation = () => {
    const errors = {};
    let formValid = true;

    if (!description) {
      formValid = false;
      errors.description = 'Cannot be empty.';
    }
    if (!amount) {
      formValid = false;
      errors.amount = 'Please enter an amount.';
    }
    if (!splitWith) {
      formValid = false;
      errors.splitWith = 'Choose somebody to split the expense with.';
    }
    if (!paidBy) {
      formValid = false;
      errors.paidBy = 'Select who paid the expense.';
    }
    if (!split) {
      formValid = false;
      errors.split = 'Choose how you want to split the bill.';
    }

    errors.formValid = formValid;
    setFieldErrors(errors);
    return formValid;
  };

  const handleAmount = value => {
    const validInput = value.match(/^(\d*\.{0,1}\d{0,2}$)/);
    if (validInput) setAmount(value);
  };

  const handleAddUser = friend => {
    setSplitWith([...splitWith, friend]);
    setOpenSelectFriends(false);
  };

  return (
    <>
      <div className="expense-container">
        <Header type="title" title="Add expense" />
        <form className="expense-form" onSubmit={handleSubmit}>
          <AmountInput
            name="amount"
            label="Amount"
            placeholder="0.00"
            fieldError={fieldErrors.amount}
            value={amount}
            onFocus={() => setFieldErrors({ ...fieldErrors, amount: null })}
            onChange={e => handleAmount(e.target.value)}
          />
          <div className="expense-input-container">
            {fieldErrors.amount && (
              <span className="field-error-text">{fieldErrors.amount}</span>
            )}
            <TextInput
              className="expense-input"
              name="description"
              label="Description"
              value={description}
              placeholder="What's it for?"
              fieldError={fieldErrors.description}
              onFocus={() =>
                setFieldErrors({ ...fieldErrors, description: null })
              }
              onChange={e => setDescription(e.target.value)}
            />
            <div className="split-with-container">
              <span className="input-label">Split with</span>
              <div className="split-with">
                {splitWith.map(member => {
                  return (
                    <UserButton
                      key={member.id}
                      user={member}
                      name={member.name}
                      variant="white"
                    />
                  );
                })}
                <button
                  type="button"
                  className="friend-add-button button--icon"
                  onClick={() => setOpenSelectFriends(true)}
                >
                  <div className="friend-add-plus"></div>
                </button>
              </div>
              {fieldErrors.splitWith && (
                <span className="field-error-text">{fieldErrors.splitWith}</span>
              )}
            </div>
            {splitWith.length > 1 && (
              <>
                <fieldset>
                  <div className="expense-input">
                    <legend className="input-label">Paid By</legend>
                    <div className="expense-radio paid-by">
                      {splitWith.map(member => {
                        return (
                          <UserButton
                            key={member.id + '-2'}
                            user={member}
                            name={member.name}
                            selected={paidBy === member.id}
                            onClick={() => {
                              setPaidBy(member.id);
                              setFieldErrors({ ...fieldErrors, paidBy: null });
                            }}
                          />
                        );
                      })}
                      {fieldErrors.paidBy && (
                        <span className="field-error-text">
                          {fieldErrors.paidBy}
                        </span>
                      )}
                    </div>
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
                      content: 'Split equally',
                    },
                    {
                      id: 'full-amount',
                      value: 'FULL_AMOUNT',
                      checked: split === 'FULL_AMOUNT',
                      content: 'Owed full amount',
                    },
                  ]}
                  onFocus={() => setFieldErrors({ ...fieldErrors, split: null })}
                  onChange={e => setSplit(e.target.value)}
                  className="expense-input"
                />
                <button
                  className="button"
                  type="submit"
                  alt="Create expense"
                  title="Create expense"
                >
                  Create
                </button>
              </>
            )}
            {fieldErrors.formValid === false && (
              <span className="field-error-text .form-validation">
                Please fix the errors to submit expense.
              </span>
            )}
          </div>
        </form>
      </div>
      <Modal open={openSelectFriends}>
        <SelectFriends handleAddUser={handleAddUser} />
      </Modal>
    </>
  );
};

export default NewExpense;
