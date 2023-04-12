import './PayUp.scss';
import Header from '../../components/Header/Header';

const PayUp = ({ open }) => {
  return (
    <>
    {open && (
      <div className="pay-up-container">
        <Header type="title" title="Pay up" />
      </div>
    )}
    </>
  )
}

export default PayUp;