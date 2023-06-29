import './Account.scss';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate, useResolvedPath } from 'react-router-dom';
import { useState } from 'react';
import { useGetAccountQuery } from '../../slices/accountSlice';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import AvatarUpload from '../../components/Avatar/AvatarUpload/AvatarUpload';

const Account = () => {
  const user = useSelector(state => state.auth.user);
  const {
    data: account,
    isSuccess
  } = useGetAccountQuery(user?.id);
  const { pathname } = useResolvedPath();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(account?.avatar_url);

  return (
    <>
      <MainHeader title="Account"
        backButton={true}
        backFn={() => {
          const newPath = pathname.replaceAll('/', '') !== 'account' ? './' : '/';
          navigate(newPath);
        }}
      />
      <div className="account-container">
        <DetailsCard
          title={account?.name}
          subTitle={account?.username ? `@${account?.username}` : null}
          avatarUrl={avatarUrl}
          skeleton={!isSuccess}>
          <AvatarUpload
            onUpload={url => {
              setAvatarUrl(url);
            }}
          />
        </DetailsCard>
        <Outlet context={{account, avatarUrl}}/>
      </div>
    </>
  );
};

export default Account;
