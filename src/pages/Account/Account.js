import './Account.scss';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AvatarUpload from '../../components/Avatar/AvatarUpload/AvatarUpload';
import { useGetAccountQuery, useUpdateAccountMutation } from '../../slices/accountSlice';
import { resetAuth } from '../../slices/authSlice';
import { supabaseApi } from '../../api/supabaseApi';
import Header from '../../components/Header/Header';

const Account = () => {
  const user = useSelector(state => state.auth.user);
  const {
    data: account,
    isSuccess
  } = useGetAccountQuery(user?.id);
  const [updateAccount, { isLoading }] = useUpdateAccountMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if(isSuccess) {
      setEmail(account.email);
      setName(account.name);
      setAvatarUrl(account.avatar_url);
    }
  }, [account, isSuccess]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAccountUpdate = async e => {
    e.preventDefault();

    const accountUpdates = {
      id: account.id,
      email,
      name,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    try {
      await updateAccount(accountUpdates).unwrap()
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogOut = async () => {
    try {
      await supabase.auth.signOut();
      supabaseApi.util.resetApiState();
      dispatch(resetAuth());
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <Header type="main" title="Account" />
    <div className="account-container">
      {isSuccess ? (
        <>
          <form className="account-form" onSubmit={handleAccountUpdate}>
            <AvatarUpload
              url={avatarUrl}
              onUpload={url => {
                setAvatarUrl(url);
              }}
            />
            <div className="account-input">
              <label className="input-label" htmlFor="email">
                Email
              </label>
              <input
                className="text-input"
                id="email"
                name="email"
                type="text"
                value={email || ''}
                disabled
              />
            </div>
            <div className="account-input">
              <label className="input-label" htmlFor="name">
                Name
              </label>
              <input
                className="text-input"
                id="name"
                name="name"
                type="text"
                value={name || ''}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <button
              className="button"
              type="submit"
              alt="Update account expense"
              title="Update account"
            >
              {isLoading ? 'Saving...' : 'Update'}
            </button>
          </form>
          <button
            type="button"
            className="button button--white"
            onClick={handleLogOut}
          >
            Log Out
          </button>
        </>
      ) : null}
    </div>
    </>
  );
};

export default Account;
