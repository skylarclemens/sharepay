import RadioSelect from '../../../components/Input/RadioSelect/RadioSelect';
import UserButton from '../../../components/User/UserButton/UserButton';
import AddUsers from '../AddUsers/AddUsers';
import Atom from '../../../components/Atom/Atom';
import { formatMoney } from '../../../helpers/money';


const NewExpenseSplit = ({ account, accountFetched, amount, paidBy, setPaidBy, splitWith, setSplitWith, split, setSplit, splitWithGroup, removeGroupSplit, setOpenSelectPeople, fieldErrors, setFieldErrors, handleSubmit }) => {
  const handleValidation = () => {
    const errors = {};
    let formValid = true;

    if (splitWith.length < 2) {
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
  }

  return (
    <div className="split-details-page">
      <Atom 
        size={120}
        numOrbitals={4}
        fade={true}
      >
        <div className="nucleus__amount">
          {formatMoney(amount, false)}
        </div>
      </Atom>
      <div className="expense-input-container">
        {accountFetched && <AddUsers account={account}
          label={'Split with'}
          usersList={splitWith}
          setUsersList={setSplitWith}
          selectedGroup={splitWithGroup}
          setOpenSelectPeople={setOpenSelectPeople}
          removeGroupSelect={removeGroupSplit} />}
        {fieldErrors.splitWith && (
          <span className="field-error-text">{fieldErrors.splitWith}</span>
        )}
      </div>
      {splitWith.length > 1 && (
        <>
          <fieldset className="expense-input-container">
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
          <div className="expense-input-container">
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
          </div>
        </>
      )}
      {fieldErrors.formValid === false && (
        <span className="field-error-text form-validation">
          Please fix the errors to submit expense.
        </span>
      )}
      <button
        className="button button--flat page-button"
        type="submit"
        alt="Create expense"
        title="Create expense"
        onClick={() => {
          if (!handleValidation()) return;
          handleSubmit();
        }}
      >
        Send
      </button>
    </div>
  )
}

export default NewExpenseSplit;