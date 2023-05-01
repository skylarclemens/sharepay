import './App.scss';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const App = () => {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => subscription.unsubscribe()
  }, []);

  return <Outlet />;
};

export default App;
