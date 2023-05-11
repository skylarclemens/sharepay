import Search from '../Search/Search';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UserResult from '../Search/UserResult/UserResult';
import { useDebounce } from '../../hooks/useDebounce';
import { useSearchAccountsQuery } from '../../slices/accountSlice';
import './SearchPeople.scss';

const SearchPeople = ({ setOpen = null }) => {
  const [value, setValue] = useState('');
  const debouncedSearchValue = useDebounce(value, 500);
  const user = useSelector(state => state.auth.user);

  const { data: searchResults,
    isSuccess: searchResultsFetched,
  } = useSearchAccountsQuery({ userId: user?.id, value: debouncedSearchValue }, {
    skip: debouncedSearchValue.length === 0,
  });

  const handleSelect = () => {
    setOpen && setOpen(false);
  }

  const renderSuggestions = (
    <div className="suggested-users">
      {searchResultsFetched && searchResults.map(suggested => (
        <Link 
          key={`${suggested.id}-search-people`}
          className="search-user button--no-style"
          to={`/people/${suggested.id}`}>
          <UserResult key={`${suggested.id}-search-people`} user={suggested} action={handleSelect} />
        </Link>
      ))}
    </div>
  )

  return (
    <div className="search-people">
      <Search value={value} setValue={setValue} suggestions={renderSuggestions} />
    </div>
  )
}

export default SearchPeople;