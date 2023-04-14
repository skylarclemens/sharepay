import './Recent.scss';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import Avatar from '../../components/Avatar/Avatar';
import { useSelector } from 'react-redux';
import Transactions from '../../components/Transactions/Transactions';

const Recent = () => {
  const [paidDebts, setPaidDebts] = useState([]);

  useEffect(() => {
    const getPaidDebts = async () => {
      const { data, error } = await supabase
        .from('debt')
        .select('*')
        .eq('paid', true);
      if(error) {
        console.error(error);
        return;
      }
      setPaidDebts(data);
    }

    getPaidDebts();
  }, []);

  return (
    <div className="recent">
      <h2 className="heading">Recent</h2>
      {paidDebts && <Transactions debts={paidDebts} paid={true} />}
    </div>
  )
}

export default Recent;