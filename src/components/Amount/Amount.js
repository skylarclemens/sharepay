import './Amount.scss';

const Amount = ({ amount, type = 'OWED' }) => {
  return (
    <div className="amount-container">
      <div
        className={`amount ${
          type === 'OWE' ? 'amount--owe' : ''
        }`}
      >
        ${amount?.toFixed(2)}
      </div>
    </div>
  )
}

export default Amount;