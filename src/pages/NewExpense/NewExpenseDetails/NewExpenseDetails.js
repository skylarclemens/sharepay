import { useState, useEffect, useRef } from 'react';
import Atom from '../../../components/Atom/Atom';
import DropdownSelect from '../../../components/Input/DropdownSelect/DropdownSelect';
import TextInput from '../../../components/Input/TextInput/TextInput';
import AmountInput from '../../../components/Input/AmountInput/AmountInput';
import DateInput from '../../../components/Input/DateInput/DateInput';

import { CATEGORIES } from '../../../constants/categories';
import Button from '../../../components/UI/Buttons/Button/Button';

const NewExpenseDetails = ({ description, setDescription, amount, setAmount, category, setCategory, date, setDate, fieldErrors, setFieldErrors, setPage }) => {
  const [categoryImg, setCategoryImg] = useState(null);

  const categoriesList = useRef(Object.entries(CATEGORIES))?.current.map(([key, value]) => {
    return {
      value: key,
      text: value?.text,
    }
  });

  useEffect(() => {
    const getCategoryImage = CATEGORIES[category]?.image;
    setCategoryImg(getCategoryImage);
  }, [category]);

  const handleAmount = value => {
    const validInput = value.match(/^(\d*\.{0,1}\d{0,2}$)/);
    if (validInput) setAmount(value);
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

    errors.formValid = formValid;
    setFieldErrors(errors);
    return formValid;
  }

  return (
    <div className="expense-details-page">
      <div className="expense-input-container">
        <TextInput
          className="expense-input big"
          name="description"
          label="Expense name"
          value={description}
          size={description.length > 0 ? description.length + 1 : 13}
          placeholder="Expense name"
          fieldError={fieldErrors.description}
          onFocus={() =>
            setFieldErrors({ ...fieldErrors, description: null })
          }
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      <Atom 
        size={120}
        numOrbitals={4}
        fade={true}
        image={
          
          <img src={categoryImg ?
            /* eslint-disable global-require */
            require(`../../../${categoryImg}`)
            /* eslint-enable global-require */
            : null} alt={`${category} icon`} style={{
            filter: 'brightness(0) invert(1)',
          }} height={48} width={41} />
        }
      >
        <DropdownSelect
          options={categoriesList}
          value={category}
          name="category-select"
          onChange={(e) => setCategory(e.target.value)}
          classes="new-expense-category small"
        />
      </Atom>
      <AmountInput
        name="amount"
        label="Amount"
        placeholder="0.00"
        fieldError={fieldErrors.amount}
        value={amount}
        classes="big"
        onFocus={() => setFieldErrors({ ...fieldErrors, amount: null })}
        onChange={e => handleAmount(e.target.value)}
      />
      <div className="bottom-container">
        <div className="bottom-inputs">
          <DateInput
            date={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <Button onClick={() => {
        if(!handleValidation()) return;
        setPage(2)
        }}>Continue</Button>
      </div>
    </div>
  )
}

export default NewExpenseDetails;