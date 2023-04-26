import './Recent.scss';
import { useSelector } from 'react-redux';
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
