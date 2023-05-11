import './Search.scss';

const Search = ({ value, setValue, suggestions }) => {
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
      </div>
      <div className="results-container">
        {suggestions}
      </div>
    </>
  )
}

export default Search;