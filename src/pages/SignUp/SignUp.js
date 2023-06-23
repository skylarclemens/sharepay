import './SignUp.scss';
import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import Button from '../../components/UI/Buttons/Button/Button';
import TextInput from '../../components/Input/TextInput/TextInput';
import logo from '../../images/Logo.svg';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSignUp = async e => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: fullName,
          },
        },
      });
      if (error) throw error;
      setSignedUp(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="sign-up-top">
      <img src={logo} alt="Celery logo" />
    </div>
    <div className="sign-up-container">
      <form className="sign-up-form form-container" onSubmit={handleSignUp}>
        <h1 className="sign-up-heading">Sign up</h1>
        <div className="input-container">
          <label className="input-label" htmlFor="email">
            Email
          </label>
          <TextInput
            className="form-text-input"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="password">
            Password
          </label>
          <TextInput
            className="form-text-input"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="name">
            Name
          </label>
          <TextInput
            className="form-text-input"
            type="text"
            id="name"
            name="name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>
      </form>
      <div className="sign-up-bottom">
        <Button
          style={{width: '100%'}}
          type="submit"
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </Button>
      </div>
      {signedUp && (
        <div className="success">
          <div style={{ 'fontFamily': 'Rubik', 'fontWeight': '500' }}>
            Signed up!
          </div>
          <div>Check your email to confirm your account.</div>
        </div>
      )}
    </div>
    </>
  );
};

export default SignUp;
