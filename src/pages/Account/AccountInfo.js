import { useOutletContext } from "react-router-dom";
import { useUpdateAccountMutation } from "../../slices/accountSlice";
import { useState, useEffect } from "react";
import TextInput from "../../components/Input/TextInput/TextInput";
import Button from "../../components/UI/Buttons/Button/Button";


const AccountInfo = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const { account } = useOutletContext();

  useEffect(() => {
    if(account) {
      setEmail(account?.email);
      setName(account?.name);
      setUsername(account?.username);
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
          <div className="account-input">
            <label className="input-label" htmlFor="username">
              Username
            </label>
            <TextInput
              className="form-text-input username-input"
              id="username"
              name="username"
              type="text"
              value={username || ''}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
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

export default AccountInfo;