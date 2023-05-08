import { useCallback, useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { supabase } from '../../supabaseClient';
import { extendedSupabaseApi } from '../../slices/accountSlice';
import { setCredentials } from '../../slices/authSlice';
import Welcome from '../../pages/Welcome/Welcome';
import { store } from '../../store/store';

const RequireAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const initializeSession = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setSession(session);
    setLoading(false);
    dispatch(setCredentials({
      session: session,
      user: session?.user ?? null,
      isLoading: false
    }));
    store.dispatch(extendedSupabaseApi.endpoints.getAccount.initiate(session?.user.id));
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    initializeSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      dispatch(setCredentials({
        session: session,
        user: session?.user ?? null,
        isLoading: false
      }));
    });
    return () => 
      subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return null;
  } else if (!session) {
    return <Welcome />;
  }
  return <Outlet />;
}

export default RequireAuth;