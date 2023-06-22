import Button from '../UI/Buttons/Button/Button';
import './Search.scss';
import { forwardRef } from 'react';

const Search = forwardRef(({ value, setValue, suggestions, onFocus, onBlur, setOpen = null }, ref) => {
  return (
    <>
      <div className="search-container">
        <input
          className="text-input search-input"
          type="search"
          value={value}
          placeholder="Search"
          onChange={e => setValue(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={ref}
        />
        {setOpen && (
          <Button variant="text" className="button--cancel" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        )}
      </div>
      <div className="results-container">
        {suggestions}
      </div>
    </>
  )
});

export default Search;