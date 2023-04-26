import './Recent.scss';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '../../supabaseClient';
import Transactions from '../../components/Transactions/Transactions';
import { selectAllPaidDebts } from '../../slices/debtSlice';

const Recent = () => {
  const paidDebts = useSelector(state => selectAllPaidDebts(state));

  return (
    <div className="recent">
      <h2 className="heading">Recent</h2>
      {paidDebts && <Transactions debts={paidDebts} paid={true} />}
    </div>
  );
};

export default Recent;
