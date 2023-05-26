import RadioSelect from '../../../components/Input/RadioSelect/RadioSelect';
import AddUsers from '../AddUsers/AddUsers';
import Atom from '../../../components/Atom/Atom';
import { formatMoney } from '../../../helpers/money';
import DropdownSelect from '../../../components/Input/DropdownSelect/DropdownSelect';
import Avatar from '../../../components/Avatar/Avatar';
import TextInput from '../../../components/Input/TextInput/TextInput';


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
          <div className="split">
            <RadioSelect
              name="expense-split"
              label="Choose split method"
              options={[
                {
                  id: 'split-equally',
                  value: 'EQUALLY',
                  checked: split === 'EQUALLY',
                  content: '=',
                },
                {
                  id: 'split-percent',
                  value: 'PERCENT',
                  checked: split === 'PERCENT',
                  content: '%',
                },
                {
                  id: 'split-exact',
                  value: 'EXACT',
                  checked: split === 'EXACT',
                  content: '$',
                },
                {
                  id: 'split-adjust',
                  value: 'ADJUST',
                  checked: split === 'ADJUST',
                  content: '+/-',
                },
              ]}
              onFocus={() => setFieldErrors({ ...fieldErrors, split: null })}
              onChange={e => setSplit(e.target.value)}
              className="radio-split"
            />
            <div className="people-split">
              {splitWith.map((member, index) => {
                return (
                  <div className="person-split" key={index}>
                    <Avatar url={member?.avatar_url} size={50} classes="white-border" />
                    <div className="person-info">
                      <span className="person-name">{member?.name}</span>
                      <span className="person-amount">33%</span>
                    </div>
                    <div className="divider"></div>
                    <TextInput
                      name={`split-${member?.id}`}
                      className="person-amount-input"
                      type="number"
                      value={formatMoney(amount, false)}
                      onChange={e => console.log(e)} />

                  </div>
              )})}
            </div>
          {fieldErrors.formValid === false && (
            <span className="field-error-text form-validation">
              Please fix the errors to submit expense.
            </span>
          )}
          </div>
        </div>
      </div>
      <button
        className="button button--flat button--medium page-button"
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