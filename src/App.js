import './App.scss';
import RoutesContainer from './routes';
import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';

const App = () => {
  const setStatusBarStyleLight = async () => {
    await StatusBar.setStyle({ style: Style.Dark });
  }
  useEffect(() => {
    setStatusBarStyleLight();
  }, []);

  return (
    <RoutesContainer />
  )
}

export default App;
