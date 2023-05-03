import './App.scss';
import { useCallback, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useDispatch } from 'react-redux';
import { setCredentials } from './slices/authSlice';
import RoutesContainer from './routes';

const App = () => {
  const dispatch = useDispatch();

  const initializeSession = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      dispatch(setCredentials({
        session: session,
        user: session?.user ?? null,
      }));
    }
  }, [dispatch]);

  useEffect(() => {
    initializeSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      dispatch(setCredentials({
        session: session,
        user: session?.user ?? null,
      }));
    });
    return () => 
      subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RoutesContainer />
  );
};

export default App;
