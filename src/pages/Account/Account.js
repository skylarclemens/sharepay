import './Account.scss';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeUser } from '../../slices/userSlice';
import AvatarUpload from '../../components/Avatar/AvatarUpload/AvatarUpload';
import { setAccountData } from '../../slices/accountSlice';

const Account = () => {
  const user = useSelector(state => state.user);
  const account = useSelector(state => state.account);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    setEmail(account.data.email);
    setName(account.data.name);
    setAvatarUrl(account.data.avatar_url);
  }, [account])

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const accountUpdates = {
      id: account.data.id,
      email,
      name,
      avatar_url: avatarUrl,
      updated_at: new Date()
    }
    try {
      const { data, error } = await supabase
      .from('users')
      .upsert(accountUpdates)
      .select();
      if ( error ) throw error;
      dispatch(setAccountData(data[0]));
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  const handleLogOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      dispatch(removeUser());
    } catch (error) {
      console.error(error);
    } finally {
      navigate('/login');
    }
  }

  return (
    <div className="account-container">
      { user ? (
        <>
        <form className="account-form" onSubmit={updateAccount}>
          <AvatarUpload
            url={avatarUrl}
            onUpload={(url) => {
              setAvatarUrl(url);
            }}
          />
          <div className="account-input">
            <label className="input-label" htmlFor="email">Email</label>
            <input id="email" name="email" type="text" value={email || ''} disabled />
          </div>
          <div className="account-input">
            <label className="input-label" htmlFor="name">Name</label>
            <input id="name" name="name" type="text" value={name || ''} onChange={(e) => setName(e.target.value)} />
          </div>
          <button className="button" type="submit" alt="Update account expense" title="Update account">
            { loading ? 'Saving...' : 'Update' }
          </button>
        </form>
        <button type="button" className="button button--white" onClick={handleLogOut}>Log Out</button>
        </>
      ) : null}
    </div>
  )
}

export default Account;