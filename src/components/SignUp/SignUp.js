import './SignUp.scss';
import { useState } from 'react';
import { supabase } from '../../supabaseClient';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: fullName
          }
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <div className="sign-up">
      <form className="sign-up-form" onSubmit={handleSignUp}>
        <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <input type="text" value={fullName} placeholder="Name" onChange={(e) => setFullName(e.target.value)} />
        <button className="button" type="submit">Sign Up</button>
      </form>
      <div>{loading ? 'Signing up...' : null}</div>
      <div>{submitted ? 'Check your email for verification' : null}</div>
    </div>
  )
}

export default SignUp;