import './NewGroup.scss';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import TextInput from '../../components/Input/TextInput/TextInput';
import Modal from '../../components/Modal/Modal';
import AddUsers from '../NewExpense/AddUsers/AddUsers';
import SelectPeople from '../../components/SelectPeople/SelectPeople';
import AvatarUpload from '../../components/Avatar/AvatarUpload/AvatarUpload';
import { GROUP_COLORS } from '../../constants/groups';
import { useGetAccountQuery } from '../../slices/accountSlice';
import { useAddNewGroupMutation, useAddNewUserGroupsMutation } from '../../slices/groupSlice';

const NewGroup = () => {
  const user = useSelector(state => state.auth.user);
  const {
    data: account,
    isSuccess: accountFetched
  } = useGetAccountQuery(user?.id);
  
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState([{ ...account }]);
  const [groupColor, setGroupColor] = useState(GROUP_COLORS[0].color);
  const [openSelectPeople, setOpenSelectPeople] = useState(false);
  const [groupAvatarUrl, setGroupAvatarUrl] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [addNewGroup, { isLoading: isGroupLoading }] = useAddNewGroupMutation();
  const [addNewUserGroups, { isLoading: isUserGroupLoading }] = useAddNewUserGroupsMutation();

  useEffect(() => {
    inputRef?.current?.click();
  }, [inputRef]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (isGroupLoading || isUserGroupLoading) return;

    const newGroup = {
      group_name: groupName,
      avatar_url: groupAvatarUrl,
      color: groupColor,
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
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUsers = users => {
    setGroupMembers(users);
    setOpenSelectPeople(false);
  };

  return (
    <>
      <Header type="title" title="Create group" />
      <div className="new-group-container">
        <form className="group-form" onSubmit={handleSubmit}>
          <AvatarUpload
            className="group-spacing"
            url={groupAvatarUrl}
            type="group"
            onUpload={url => {
              setGroupAvatarUrl(url);
            }} />
          <TextInput
            className="group-spacing"
            name="name"
            label="Group name"
            value={groupName}
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
          <div className="input-container group-spacing">
            <div className="input-label">Group color</div>
            <div className="group-colors">
              {GROUP_COLORS.map(color => {
                return (
                  <div className={`group-color ${groupColor === color.color ? 'selected' : ''}`} key={color.hex}>
                    <div
                      key={color.hex}
                      className={`group-color-option ${color.color}`}
                      onClick={() => setGroupColor(color.color)}
                    ></div>
                    <span className="color-name">{color.color}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            type="submit"
            alt="Create group"
            title="Create group"
            className="button group-spacing"
          >
            Create
          </button>
        </form>
      </div>
      <Modal open={openSelectPeople}>
        <SelectPeople handleAdd={handleAddUsers} existingUsers={groupMembers} />
      </Modal>
    </>
  );
};

export default NewGroup;
