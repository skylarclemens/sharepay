import './NewGroup.scss';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TextInput from '../../components/Input/TextInput/TextInput';
import Modal from '../../components/Modal/Modal';
import AddUsers from '../NewExpense/AddUsers/AddUsers';
import SelectPeople from '../../components/SelectPeople/SelectPeople';
import AvatarUpload from '../../components/Avatar/AvatarUpload/AvatarUpload';
import Atom from '../../components/Atom/Atom';
import { useGetAccountQuery } from '../../slices/accountSlice';
import { useAddNewGroupMutation, useAddNewUserGroupsMutation, useDeleteGroupUsersMutation, useUpdateGroupMutation, useUpdateGroupUsersMutation } from '../../slices/groupSlice';
import { useAddActivityMutation } from '../../slices/activityApi';
import groupImg from '../../images/Group_white.svg';
import Avatar from '../../components/Avatar/Avatar';
import Button from '../../components/UI/Buttons/Button/Button';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';

const NewGroup = ({ modify = false, groupData, members, setOpen, className = '' }) => {
  const user = useSelector(state => state.auth.user);
  const {
    data: account,
    isSuccess: accountFetched
  } = useGetAccountQuery(user?.id);
  
  const [groupName, setGroupName] = useState(modify ? groupData?.group_name : '');
  const [groupMembers, setGroupMembers] = useState(modify ? members.map(member => member.user) : [account]);
  const [openSelectPeople, setOpenSelectPeople] = useState(false);
  const [groupAvatarUrl, setGroupAvatarUrl] = useState(modify ? groupData?.avatar_url : null);
  const [groupElectrons, setGroupElectrons] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [addNewGroup, { isLoading: isGroupLoading }] = useAddNewGroupMutation();
  const [addNewUserGroups, { isLoading: isUserGroupLoading }] = useAddNewUserGroupsMutation();
  const [addActivity, { isLoading: isActivityLoading }] = useAddActivityMutation();
  const [updateGroup, { isLoading: isUpdateGroupLoading }] = useUpdateGroupMutation();
  const [updateGroupUsers, { isLoading: isUpdateGroupUsersLoading }] = useUpdateGroupUsersMutation();
  const [deleteGroupUsers] = useDeleteGroupUsersMutation();

  useEffect(() => {
    if(!modify) inputRef?.current?.click();
  }, [inputRef, modify]);

  const handleNewSubmit = async e => {
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
    } catch (error) {
      console.error(error);
    }
    navigate(`/group/${groupData.id}`);
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    if (isUpdateGroupLoading) return;
    try {
      await updateGroup({
        id: groupData.id,
        group_name: groupName,
        avatar_url: groupAvatarUrl,
      }).unwrap();
    } catch (error) {
      console.error(error);
    }
    handleUpdateUsers();
  }

  const handleUpdateUsers = async () => {
    // Return if update is already sent
    if (isUpdateGroupUsersLoading) return;
    // Get all the users that are removed from the group members list
    const checkDeleteMembers = members?.filter(member => {
      return !groupMembers.find(user => user.id === member.user.id);
    });
    const updatedMembers = groupMembers.map(member => {
      return {
        user_id: member.id,
        group_id: groupData.id,
      };
    });
    try {
      await updateGroupUsers(updatedMembers).unwrap();
    } catch (error) {
      console.error(error);
    }

    if(checkDeleteMembers.length > 0) {
      const deleteMembers = checkDeleteMembers.map(member => member.id);
      try {
        await deleteGroupUsers(deleteMembers).unwrap();
      } catch (error) {
        console.error(error);
      }
    }

    setOpen(false);
  }

  const handleAddUsers = users => {
    setGroupMembers([account, ...users]);
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
          title={modify ? 'Edit group' : 'Create group'}
          backButton={!modify}
          className="header--transparent"
          right={modify ? <Button
            type="button"
            variant="icon"
            alt="Close"
            title="Close"
            className="close-button"
            onClick={() => setOpen(false)}
          >
            &times;
          </Button> : null
          }
          color="#787878" />
      <div className={`new-group-container ${modify ? 'edit-group' : ''} ${className}`}>
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
        <form className="group-form" onSubmit={modify ? handleEditSubmit : handleNewSubmit}>
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
            setUsersList={setGroupMembers}
            setOpenSelectPeople={setOpenSelectPeople}
          /> : null}
          <Button
            type="submit"
            alt="Create group"
            title="Create group"
            className="group-create-button"
          >
            {modify ? 'Save' : 'Create'}
          </Button>
        </form>
      </div>
      <Modal open={openSelectPeople}>
        <SelectPeople handleAdd={handleAddUsers} existingUsers={groupMembers.filter(member => member.id !== user.id)} setOpen={setOpenSelectPeople} />
      </Modal>
    </>
  );
};

export default NewGroup;
