import './Account.scss';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate, useResolvedPath } from 'react-router-dom';
import { useState } from 'react';
import { useGetAccountQuery } from '../../slices/accountSlice';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';
import DetailsCard from '../../components/DetailsCard/DetailsCard';
import Button from '../../components/UI/Buttons/Button/Button';
import AvatarUpload from '../../components/Avatar/AvatarUpload/AvatarUpload';
import Modal from '../../components/Modal/Modal';
import { Camera } from '../../components/Icons';

const Account = () => {
  const [openAvatarUpload, setOpenAvatarUpload] = useState(false);
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
        backButton={pathname.replaceAll('/', '') !== 'account' ? true : false}
        backFn={() => navigate('./')} />
      <div className="account-container">
        <DetailsCard
          title={account?.name}
          subTitle={`@${account?.username}`}
          avatarUrl={account?.avatar_url}
          skeleton={!isSuccess}>
          <Button variant="icon"
            className="avatar-camera"
            onClick={() => setOpenAvatarUpload(true)}>
            <Camera fill="#787878" />
          </Button>
        </DetailsCard>
        <Outlet context={{account, avatarUrl}}/>
      </div>
      <Modal open={openAvatarUpload}
        style={{
          background: '#ffffff',
          borderRadius: '1rem',
          height: 'auto',
          width: 'auto',
          padding: '1rem',
          margin: '1rem'
        }}
        handleClose={() => setOpenAvatarUpload(false)}>
        <AvatarUpload
          url={account?.avatar_url}
          onUpload={url => {
            setAvatarUrl(url);
          }} />
      </Modal>
    </>
  );
};

export default Account;
