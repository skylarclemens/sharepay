import './SignUp.scss';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { setUser } from '../../slices/userSlice';

const SignUp = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    const newUser = {
      email: email,
      name: name,
      balance: 0,
      total_owed: 0,
      total_owe: 0,
      groups: []
    }
    dispatch(setUser(newUser));
  }

  return (
    <div className="sign-up">
      <form className="sign-up-form" onSubmit={handleSignUp}>
        <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="text" value={name} placeholder ="Name" onChange={(e) => setName(e.target.value)} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUp;