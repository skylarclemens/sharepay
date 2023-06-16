import './Split.scss';
import { useState, useEffect } from 'react';
import RadioSelect from '../Input/RadioSelect/RadioSelect';
import TextInput from '../Input/TextInput/TextInput';
import Avatar from '../Avatar/Avatar';
import { formatMoney } from '../../helpers/money';
import { useDebounce } from '../../hooks/useDebounce';

const Split = ({ split, setSplit, splitWith, fieldErrors, setFieldErrors, account, amount }) => {
  const [splitValues, setSplitValues] = useState({});
  const [percentInput, setPercentInput] = useState({});
  const [amountInput, setAmountInput] = useState({});

  const debouncedPercentInput = useDebounce(percentInput, 500);
  const debouncedAmountInput = useDebounce(amountInput, 500);

  const calcSplit = (amount, input = {}, split, splitUsers) => {
    let userSplits = {}
    switch (split) {
      case 'EQUAL':
        splitUsers.forEach(user => {
          userSplits[user?.id] = {
            amount: amount / splitUsers.length,
            percent: 100 / splitUsers.length
          };
        });
        break;
      case 'PERCENT':
        splitUsers.forEach(user => {
          userSplits[user?.id] = {
            amount: amount * (input[user?.id] / 100),
            percent: input[user?.id]
          };
        });
        break;
      case 'EXACT':
        splitUsers.forEach(user => {
          userSplits[user?.id] = {
            amount: input[user?.id],
            percent: (input[user?.id] / amount) * 100
          };
        });
        break;
      default:
        break;
    }
    return userSplits;
  }

  useEffect(() => {
    setSplitValues({})
    if (split !== 'EQUAL') return;
    const usersSplit = calcSplit(amount, {}, split, splitWith);
    setSplitValues(usersSplit);
  }, [amount, split, splitWith]);

  useEffect(() => {
    if(split !== 'PERCENT' || !Object.keys(debouncedPercentInput).length) return;
    const usersSplit = calcSplit(amount, debouncedPercentInput, split, splitWith);
    setSplitValues(usersSplit);
  }, [splitWith, split, amount, debouncedPercentInput]);

  useEffect(() => {
    if(split !== 'EXACT' || !Object.keys(debouncedAmountInput).length) return;
    const usersSplit = calcSplit(amount, debouncedAmountInput, split, splitWith);
    setSplitValues(usersSplit);
  }, [splitWith, split, amount, debouncedAmountInput]);

  

  return (
    <div className="split">
      <RadioSelect
        name="expense-split"
        label="Choose split method"
        options={[
          {
            id: 'split-equally',
            value: 'EQUAL',
            checked: split === 'EQUAL',
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
        ]}
        onFocus={() => setFieldErrors({ ...fieldErrors, split: null })}
        onChange={e => setSplit(e.target.value)}
        className="radio-split"
      />
      <div className="people-split">
        {splitWith.map((member, index) => {
          const usersName = member?.id === account?.id ? 'You' : member?.name;
          return (
            <div className="person-split" key={index}>
              <Avatar url={member?.avatar_url} size={50} classes="white-border" />
                {split === 'EQUAL' ? (
                  <>
                    <div className="person-info">
                      <span className="person-name">{usersName}</span>
                      <span className="person-amount">
                      {`${splitValues[member?.id]?.percent ? splitValues[member?.id]?.percent : 0}%`}
                      </span>
                    </div>
                    <div className="divider"></div>
                    <TextInput
                      name={`amount-${member?.id}`}
                      className="person-amount-input"
                      style={{textAlign: 'center'}}
                      value={formatMoney(splitValues[member?.id]?.amount || 0, false)}
                      readOnly={true}
                      disabled={true}
                    />
                  </>
                ) : null}
                {split === 'PERCENT' ? (
                  <>
                    <div className="person-info">
                      <span className="person-name">{usersName}</span>
                      <span className="person-amount">
                        {formatMoney(splitValues[member?.id]?.amount || 0, false)}
                      </span>
                    </div>
                    <div className="divider"></div>
                    <TextInput
                      name={`percent-${member?.id}`}
                      className="person-amount-input split-percent"
                      placeholder="0"
                      type="number"
                      inputMode="decimal"
                      value={percentInput[member?.id] || ''}
                      onChange={e => setPercentInput(prevState => ({...prevState, [member?.id]: e.target.value}))}
                    />
                  </>
                ) : null}
                {split === 'EXACT' ? (
                  <>
                    <div className="person-info">
                      <span className="person-name">{usersName}</span>
                      <span className="person-amount">
                        {`${splitValues[member?.id]?.percent ? splitValues[member?.id]?.percent : 0}%`}
                      </span>
                    </div>
                    <div className="divider"></div>
                    <TextInput
                      name={`amount-${member?.id}`}
                      className="person-amount-input split-amount"
                      placeholder="0"
                      type="number"
                      inputMode="decimal"
                      value={amountInput[member?.id] || ''}
                      onChange={e => setAmountInput(prevState => ({...prevState, [member?.id]: e.target.value}))}
                    />
                  </>
                ) : null}
            </div>
        )})}
    </div>
  </div>
  )
}

export default Split;