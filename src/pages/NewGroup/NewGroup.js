import './NewGroup.scss';
import { useState } from 'react';
import Header from '../../components/Header/Header';
import TextInput from '../../components/Input/TextInput/TextInput';
import Modal from '../../components/Modal/Modal';
import SelectFriends from '../../components/SelectFriends/SelectFriends';

const NewGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
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
        <form className="group-form group-input-container" onSubmit={handleSubmit}>
          <TextInput name="name" label="Group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          <div className="add-friends input-container">
            <span className="input-label">Group members</span>
            <button className="button" onClick={() => setOpenSelectFriends(true)}>Add friend</button>
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