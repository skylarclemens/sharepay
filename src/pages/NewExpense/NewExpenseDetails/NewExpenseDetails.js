import { useState, useEffect, useRef } from 'react';
import Atom from '../../../components/Atom/Atom';
import DropdownSelect from '../../../components/Input/DropdownSelect/DropdownSelect';
import TextInput from '../../../components/Input/TextInput/TextInput';
import AmountInput from '../../../components/Input/AmountInput/AmountInput';

import { CATEGORIES } from '../../../constants/categories';

const NewExpenseDetails = ({ description, setDescription, amount, setAmount, fieldErrors, setFieldErrors, setPage, handleValidation }) => {
  const [categoryImg, setCategoryImg] = useState(null);
  const [category, setCategory] = useState('category');

  let categoriesList = useRef(Object.keys(CATEGORIES));

  useEffect(() => {
    const getCategoryImage = CATEGORIES[category]?.image;
    setCategoryImg(getCategoryImage);
  }, [category]);

  const handleAmount = value => {
    const validInput = value.match(/^(\d*\.{0,1}\d{0,2}$)/);
    if (validInput) setAmount(value);
  };

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
          /* eslint-disable global-require */
          <img src={categoryImg ? require(`../../../${categoryImg}`) : null} alt={`${category} icon`} style={{
            filter: 'brightness(0) invert(1)',
          }} height={48} width={41} />
          /* eslint-enable global-require */
        }
      >
        <DropdownSelect
          options={categoriesList.current}
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
      <button type="button" className="page-button button button--flat button--medium" onClick={
        () => {
          if(!handleValidation()) return;
          setPage(2)
        }
      }>Continue</button>
    </div>
  )
}

export default NewExpenseDetails;