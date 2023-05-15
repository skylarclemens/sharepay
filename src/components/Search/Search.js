import './Search.scss';

const Search = ({ value, setValue, suggestions, setOpen = null }) => {
  return (
    <>
      <div className="search-container">
        <input
          className="text-input search-input"
          type="search"
          value={value}
          placeholder="Search..."
          onChange={e => setValue(e.target.value)}
        />
        {setOpen && (
          <button
            className="button button--transparent button--icon button--cancel"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        )}
      </div>
      <div className="results-container">
        {suggestions}
      </div>
    </>
  )
}

export default Search;