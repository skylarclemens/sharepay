import './App.scss';
//import { useEffect } from 'react';
//import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
//import { supabase } from './supabaseClient';
//import { removeUser } from './slices/userSlice';

const App = () => {
  return <Outlet />;
};

export default App;
