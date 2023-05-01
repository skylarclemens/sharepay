import './App.scss';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useDispatch } from 'react-redux';
import { setCredentials, resetAuth } from './slices/authSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(setCredentials({
          session: session,
          user: session.user
        }));
      } else {
        console.log('here');
        dispatch(resetAuth());
      }
    })
    
    return () => subscription.unsubscribe()
  }, []);

  return <Outlet />;
};

export default App;
