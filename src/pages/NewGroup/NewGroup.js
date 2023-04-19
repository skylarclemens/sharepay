import './NewGroup.scss';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import TextInput from '../../components/Input/TextInput/TextInput';
import Modal from '../../components/Modal/Modal';
import SelectFriends from '../../components/SelectFriends/SelectFriends';
import UserButton from '../../components/User/UserButton/UserButton';

const NewGroup = () => {
  const account = useSelector(state => state.account.data);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState([{...account}]);
  const [openSelectFriends, setOpenSelectFriends] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleAddUser = (friend) => {
    setGroupMembers([...groupMembers, friend]);
    setOpenSelectFriends(false);
  }

  return (
    <>
      <div className="new-group-container">
        <Header type="title" title="Create group" />
        <form className="group-form" onSubmit={handleSubmit}>
          <TextInput className="group-spacing" name="name" label="Group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          <div className="add-friends input-container">
            <span className="input-label group-spacing">Group members</span>
            <div className="group-members">
              {groupMembers.map((member) => {
                return (
                  <UserButton key={member.id}
                    user={member}
                    name={member.name}
                    variant="white"
                  />
                )
              })}
              <button className="friend-add-button button--icon" onClick={() => setOpenSelectFriends(true)}><div className="friend-add-plus"></div></button>
            </div>
          </div>
        </form>
      </div>
      <Modal open={openSelectFriends}>
        <SelectFriends handleAddUser={handleAddUser} />
      </Modal>
    </>
  )
}

export default NewGroup;