import { useOutletContext } from "react-router-dom";
import { useUpdateAccountMutation } from "../../slices/accountSlice";
import { useState, useEffect } from "react";
import AvatarUpload from "../../components/Avatar/AvatarUpload/AvatarUpload";
import TextInput from "../../components/Input/TextInput/TextInput";
import Button from "../../components/UI/Buttons/Button/Button";


const ProfileInfo = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const { account } = useOutletContext();

  useEffect(() => {
    if(account) {
      setEmail(account?.email);
      setName(account?.name);
      setUsername(account?.username);
      setAvatarUrl(account?.avatar_url);
    }
  }, [account]);

  const [updateAccount, { isLoading }] = useUpdateAccountMutation();

  const handleAccountUpdate = async e => {
    e.preventDefault();

    const accountUpdates = {
      id: account.id,
      email,
      name,
      username,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    try {
      await updateAccount(accountUpdates).unwrap()
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="account-info">
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
            <label className="input-label" htmlFor="username">
              Username
            </label>
            <TextInput
              className="form-text-input"
              id="username"
              name="username"
              type="text"
              value={username || ''}
              onChange={e => setUsername(e.target.value)}
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
      </>
    </div>
  )
}

export default ProfileInfo;