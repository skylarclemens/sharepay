import './Account.scss';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate, useResolvedPath } from 'react-router-dom';
import { useGetAccountQuery } from '../../slices/accountSlice';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';
import DetailsCard from '../../components/DetailsCard/DetailsCard';

const Account = () => {
  const user = useSelector(state => state.auth.user);
  const {
    data: account,
    isSuccess
  } = useGetAccountQuery(user?.id);
  const { pathname } = useResolvedPath();
  const navigate = useNavigate();
  console.log(navigate);

  return (
    <>
      <MainHeader title="Account"
        left={
          !pathname === '/account' && (
            <button className="btn btn--icon btn--transparent btn--back">
              <i className="fas fa-arrow-left"></i>
            </button>
          )
        } />
      <div className="account-container">
        <DetailsCard
          title={account?.name}
          subTitle={`@${account?.username}`}
          avatarUrl={account?.avatar_url}
          skeleton={!isSuccess}
        />
        <Outlet context={{ account }}/>
      </div>
    </>
  );
};

export default Account;
