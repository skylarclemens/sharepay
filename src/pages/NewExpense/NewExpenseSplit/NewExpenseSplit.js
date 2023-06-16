import AddUsers from '../AddUsers/AddUsers';
import Atom from '../../../components/Atom/Atom';
import { formatMoney } from '../../../helpers/money';
import DropdownSelect from '../../../components/Input/DropdownSelect/DropdownSelect';
import Split from '../../../components/Split/Split';


const NewExpenseSplit = ({ account, accountFetched, amount, paidBy, setPaidBy, splitWith, setSplitWith, split, setSplit, splitValues, setSplitValues, splitWithGroup, removeGroupSplit, setOpenSelectPeople, fieldErrors, setFieldErrors, handleSubmit }) => {
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
      <div className="split-inputs">
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
        <div className="expense-input-container expense-input">
          <span className="input-label">Paid By</span>
          <div className="paid-by">
            <DropdownSelect
              value={paidBy}
              name="paid-by-select"
              options={splitWith.map(member => {
                return {
                  value: member?.id,
                  text: account?.id === member?.id ? 'You' : member?.name,
                }})}
              onChange={e => {
                setPaidBy(e.target.value);
                setFieldErrors({ ...fieldErrors, paidBy: null });
              }}
             />
            {fieldErrors.paidBy && (
              <span className="field-error-text">
                {fieldErrors.paidBy}
              </span>
            )}
          </div>
        </div>
        <div className="expense-input-container expense-input">
          <span className="input-label">Split</span>
          <Split
            split={split}
            setSplit={setSplit}
            splitWith={splitWith}
            splitValues={splitValues}
            setSplitValues={setSplitValues}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
            account={account}
            amount={amount} />
          {fieldErrors.formValid === false && (
            <span className="field-error-text form-validation">
              Please fix the errors to submit expense.
            </span>
          )}
        </div>
      </div>
      <button
        className="button button--flat button--medium page-button"
        type="submit"
        alt="Create expense"
        title="Create expense"
        onClick={(e) => {
          if (!handleValidation()) return;
          handleSubmit(e);
        }}
      >
        Send
      </button>
    </div>
  )
}

export default NewExpenseSplit;