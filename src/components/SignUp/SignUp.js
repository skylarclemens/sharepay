import './SignUp.scss';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { setUser } from '../../slices/userSlice';
import { supabase } from '../../supabaseClient';

const SignUp = () => {
  const [loading, setLoading] = useState(false);

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
    }
  }

  return (
    <div className="sign-up">
      {loading ? 'Signing up...' :
        (<form className="sign-up-form" onSubmit={handleSignUp}>
          <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <input type="text" value={fullName} placeholder="Full name" onChange={(e) => setFullName(e.target.value)} />
          <button className="button" type="submit">Sign Up</button>
        </form>
      )}
    </div>
  )
}

export default SignUp;