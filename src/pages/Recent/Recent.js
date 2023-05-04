import './Recent.scss';
import Transactions from '../../components/Transactions/Transactions';
import { useGetDebtsQuery } from '../../slices/debtSlice';
import { useMemo } from 'react';
import { createSelector } from '@reduxjs/toolkit';

const Recent = () => {
  const selectPaidDebts = useMemo(() => {
    return createSelector(
      res => res?.data,
      data => data?.filter(debt => debt.paid === true) ?? []
    )
  }, []);

  const { paidDebts, isSuccess } = useGetDebtsQuery(undefined, {
    selectFromResult: result => ({
      ...result,
      paidDebts: selectPaidDebts(result)
    })
  })

  return (
    <div className="recent">
      <h2 className="heading">Recent</h2>
      {isSuccess && <Transactions debts={paidDebts} paid={true} />}
    </div>
  );
};

export default Recent;
