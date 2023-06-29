import './NewGroup.scss';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TextInput from '../../components/Input/TextInput/TextInput';
import DropdownSelect from '../../components/Input/DropdownSelect/DropdownSelect';
import Modal from '../../components/Modal/Modal';
import AddUsers from '../NewExpense/AddUsers/AddUsers';
import SelectPeople from '../../components/SelectPeople/SelectPeople';
import AvatarUpload from '../../components/Avatar/AvatarUpload/AvatarUpload';
import Atom from '../../components/Atom/Atom';
import { useGetAccountQuery } from '../../slices/accountSlice';
import { useAddNewGroupMutation, useAddNewUserGroupsMutation } from '../../slices/groupSlice';
import { useAddActivityMutation } from '../../slices/activityApi';
import groupImg from '../../images/Group_white.svg';
import Avatar from '../../components/Avatar/Avatar';
import Button from '../../components/UI/Buttons/Button/Button';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';

const NewGroup = () => {
  const user = useSelector(state => state.auth.user);
  const {
    data: account,
    isSuccess: accountFetched
  } = useGetAccountQuery(user?.id);
  
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState([{ ...account }]);
  const [openSelectPeople, setOpenSelectPeople] = useState(false);
  const [groupAvatarUrl, setGroupAvatarUrl] = useState(null);
  const [groupElectrons, setGroupElectrons] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [addNewGroup, { isLoading: isGroupLoading }] = useAddNewGroupMutation();
  const [addNewUserGroups, { isLoading: isUserGroupLoading }] = useAddNewUserGroupsMutation();
  const [addActivity, { isLoading: isActivityLoading }] = useAddActivityMutation();

  useEffect(() => {
    inputRef?.current?.click();
  }, [inputRef]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (isGroupLoading || isUserGroupLoading || isActivityLoading) return;

    const newGroup = {
      group_name: groupName,
      avatar_url: groupAvatarUrl,
    };

    let groupData;
    try {
      [groupData] = await addNewGroup(newGroup).unwrap();
    } catch (error) {
      console.error(error);
    }

    const newMembers = groupMembers.map(member => {
      return {
        user_id: member.id,
        group_id: groupData.id,
      };
    });

    try {
      await addNewUserGroups(newMembers).unwrap();
    } catch (error) {
      console.error(error);
    }

    try {
      await addActivity({
        user_id: user.id,
        reference_id: groupData.id,
        type: 'GROUP',
        action: 'CREATE',
      }).unwrap();
      navigate(`/group/${groupData.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUsers = users => {
    setGroupMembers(users);
    setOpenSelectPeople(false);
  };

  useEffect(() => {
    const electrons = groupMembers.map((member, index) => {
      if(index < 4) {
        return [{
          url: member.avatar_url
        }];
      }
      return null;
    });

    setGroupElectrons(electrons);
  }, [groupMembers]);

  return (
    <>
      <MainHeader
          title="Create group"
          backButton={true}
          className="header--transparent"
          color="#787878" />
      <div className="new-group-container">
        <Atom
          orbitals={groupElectrons}
          image={
            groupAvatarUrl ? <Avatar url={groupAvatarUrl} size={140} type="group" classes="white-border" /> :
            <img src={groupImg} alt="Group icon" className="group-icon" height="60" width="60"/>
          }
          icon={
            <AvatarUpload
              url={groupAvatarUrl}
              type="group"
              onUpload={url => {
                setGroupAvatarUrl(url);
              }} 
            />
          }
          size={140}
          fade={true} />
        <form className="group-form" onSubmit={handleSubmit}>
          <TextInput
            className="group-name-input"
            name="group-name"
            value={groupName}
            placeholder="Group name"
            ref={inputRef}
            onChange={e => setGroupName(e.target.value)}
          />
          {accountFetched ? <AddUsers
            label={'Group members'}
            account={account}
            usersList={groupMembers}
            setUsersList={handleAddUsers}
            setOpenSelectPeople={setOpenSelectPeople}
          /> : null}
          <Button
            type="submit"
            alt="Create group"
            title="Create group"
            className="group-create-button"
          >
            Create
          </Button>
        </form>
      </div>
      <Modal open={openSelectPeople}>
        <SelectPeople handleAdd={handleAddUsers} existingUsers={groupMembers.slice(1)} setOpen={setOpenSelectPeople} />
      </Modal>
    </>
  );
};

export default NewGroup;
