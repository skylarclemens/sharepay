import RadioSelect from '../../../components/Input/RadioSelect/RadioSelect';
import UserButton from '../../../components/User/UserButton/UserButton';
import AddUsers from '../AddUsers/AddUsers';


const NewExpenseSplit = ({ account, accountFetched, paidBy, setPaidBy, splitWith, setSplitWith, split, setSplit, splitWithGroup, removeGroupSplit, setOpenSelectPeople, fieldErrors, setFieldErrors }) => {
  return (
    <div className="split-details-page">
      <>
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
        <span className="field-error-text form-validation">
          Please fix the errors to submit expense.
        </span>
      )}
    </div>
  )
}

export default NewExpenseSplit;