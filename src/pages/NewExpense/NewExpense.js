import './NewExpense.scss';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddNewExpenseMutation } from '../../slices/expenseSlice';
import { useAddNewDebtMutation } from '../../slices/debtSlice';
import { getAllGroupsUsers } from '../../services/groups';
import Header from '../../components/Header/Header';
import TextInput from '../../components/Input/TextInput/TextInput';
import AmountInput from '../../components/Input/AmountInput/AmountInput';
import RadioSelect from '../../components/Input/RadioSelect/RadioSelect';
import UserButton from '../../components/User/UserButton/UserButton';
import Modal from '../../components/Modal/Modal';
import SelectFriends from '../../components/SelectFriends/SelectFriends';
import { useNavigate } from 'react-router-dom';
import { useGetAccountQuery } from '../../slices/accountSlice';
import SplitWith from './SplitWith/SplitWith';

const NewExpense = () => {
  const user = useSelector(state => state.auth.user);
  const {
    data: account,
    isSuccess: accountFetched
  } = useGetAccountQuery(user?.id);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitWith, setSplitWith] = useState([]);
  const [splitWithGroup, setSplitWithGroup] = useState(null);
  const [paidBy, setPaidBy] = useState(user?.id);
  const [split, setSplit] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [openSelectFriends, setOpenSelectFriends] = useState(false);
  const navigate = useNavigate();

  const [addNewExpense, { isExpenseLoading }] = useAddNewExpenseMutation();
  const [addNewDebt, { isDebtLoading }] = useAddNewDebtMutation();

  const handleSubmit = async e => {
    e.preventDefault();
    setFieldErrors({ ...fieldErrors, formValid: true });

    if (!handleValidation() || isExpenseLoading || isDebtLoading) return;

    const groupId = splitWithGroup?.id || null;

    let expenseData;
    const newExpense = {
      payer_id: paidBy,
      description: description,
      amount: amount,
      group_id: groupId
    };

    try {
      [expenseData] = await addNewExpense(newExpense).unwrap();
    } catch (error) {
      console.error(error);
    }
    const numDebts = splitWith.length;
    const debtAmount = split === 'EQUALLY' ? amount / numDebts : amount / (numDebts - 1);
    const newDebt = splitWith.filter(friend => !(friend.id === paidBy)).map(friend => {
      return {
        creditor_id: paidBy,
        debtor_id: friend.id,
        amount: debtAmount,
        expense_id: expenseData.id,
        group_id: groupId
      }
    });

    try {
      await addNewDebt(newDebt).unwrap();
      navigate(`/expense/${expenseData.id}`);
    } catch (error) {
      console.error(error);
    }
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

  const handleAdd = selected => {
    if (selected?.group_name) {
      setSplitWithGroup(selected);
      const groupsUsers = getAllGroupsUsers(selected.id);
      groupsUsers.then(res => {
        setSplitWith(res)
      });
    } else {
      setSplitWith([...splitWith, selected]);
    }
    setOpenSelectFriends(false);
  };

  const removeGroupSplit = () => {
    setSplitWithGroup(null);
    setSplitWith([account]);
  }

  return (
    <>
      <Header type="title" title="Add expense" />
      <div className="expense-container">
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
            <>
              {accountFetched && <SplitWith account={account}
                splitWith={splitWith}
                setSplitWith={setSplitWith}
                splitWithGroup={splitWithGroup}
                setOpenSelectFriends={setOpenSelectFriends}
                removeGroupSplit={removeGroupSplit} />}
              {fieldErrors.splitWith && (
                <span className="field-error-text">{fieldErrors.splitWith}</span>
              )}
            </>
            {splitWith.length > 1 && (
              <>
                <fieldset>
                  <div className="expense-input">
                    <legend className="input-label">Paid By</legend>
                    <div className="expense-radio paid-by">
                      {splitWith.map(member => {
                        return (
                          <UserButton
                            key={member?.id + '-2'}
                            user={member}
                            name={member?.name}
                            selected={paidBy === member?.id}
                            onClick={() => {
                              setPaidBy(member?.id);
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
        <SelectFriends handleAdd={handleAdd} showGroups={true} />
      </Modal>
    </>
  );
};

export default NewExpense;
