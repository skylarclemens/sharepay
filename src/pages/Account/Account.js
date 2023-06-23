import './Account.scss';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AvatarUpload from '../../components/Avatar/AvatarUpload/AvatarUpload';
import { useGetAccountQuery, useUpdateAccountMutation } from '../../slices/accountSlice';
import { userLogout } from '../../slices/authSlice';
import { supabaseApi } from '../../api/supabaseApi';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';
import Button from '../../components/UI/Buttons/Button/Button';
import TextInput from '../../components/Input/TextInput/TextInput';

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
      dispatch(supabaseApi.util.resetApiState());
      dispatch(userLogout());
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <MainHeader title="Account" />
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
              <TextInput
                className="form-text-input"
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
              <TextInput
                className="form-text-input"
                id="name"
                name="name"
                type="text"
                value={name || ''}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              alt="Update account expense"
              title="Update account"
            >
              {isLoading ? 'Saving...' : 'Update'}
            </Button>
          </form>
          <Button
            variant="secondary"
            onClick={handleLogOut}
          >
            Log Out
          </Button>
        </>
      ) : null}
    </div>
    </>
  );
};

export default Account;
