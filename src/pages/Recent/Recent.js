import './Recent.scss';
import { useGetPaidUpsQuery } from '../../slices/paidApi';
import Avatar from '../../components/Avatar/Avatar';

const Recent = () => {
  /**/

  const {
    data: paidUps,
    isSuccess: paidUpsFetched
  } = useGetPaidUpsQuery();

  /*const { paidDebts, isSuccess } = useGetDebtsQuery(undefined, {
    selectFromResult: result => ({
      ...result,
      paidDebts: selectPaidDebts(result)
    })
  })*/

  return (
    <div className="recent">
      <h2 className="heading">Recent</h2>
      {paidUpsFetched && paidUps.map((paidUp) => {
        return (
          <div className="paid-up" key={paidUp.id}>
            <Avatar url={paidUp.creditor_id?.avatar_url} classes="white-border" size={40} />
            <Avatar url={paidUp.debtor_id?.avatar_url} classes="white-border" size={40} />
            {paidUp.debtor_id.name} paid {paidUp.creditor_id.name}
          </div>
        )
      })}
    </div>
  );
};

export default Recent;
