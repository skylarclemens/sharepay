import './Recent.scss';
import { useGetPaidUpsQuery } from '../../slices/paidApi';
import Transaction from '../../components/Transaction/Transaction';
import Header from '../../components/Header/Header';

const Recent = () => {
  const {
    data: paidUps,
    isSuccess: paidUpsFetched
  } = useGetPaidUpsQuery();

  const paidText = (debtor, creditor, date) => (
    <div className="paid-info">
      <div className="paid-text">
        <span>{debtor.name}</span>
        paid
        <span>{creditor.name}</span>
      </div>
      <div className="paid-date">
        {new Date(date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </div>
    </div>
  )

  const transactionRight = (
    <div className="debt-paid">
      PAID UP
    </div>
  )
  

  return (
    <>
    <Header type="main" title="Recent" />
    <div className="recent">
      {paidUpsFetched && paidUps.map((paidUp) => {
        return (
          <div className="paid-up" key={paidUp.id}>
            <Transaction
              avatarUrls={[
                paidUp.creditor_id?.avatar_url,
                paidUp.debtor_id?.avatar_url
              ]}
              text={paidText(paidUp.debtor_id, paidUp.creditor_id, paidUp.created_at)}
              transactionRight={transactionRight}
              showArrow={false}
            />
            
          </div>
        )
      })}
    </div>
    </>
  );
};

export default Recent;
