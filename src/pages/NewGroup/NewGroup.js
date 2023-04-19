import './NewGroup.scss';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '../../components/Header/Header';
import TextInput from '../../components/Input/TextInput/TextInput';

const NewGroup = () => {
  const account = useSelector(state => state.account.data);
  const friends = useSelector(state => state.friends.data);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div className="new-group-container">
      <Header type="title" title="Create group" />
      <form className="group-form input-container" onSubmit={handleSubmit}>
        <TextInput name="name" label="Group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
        <div className="add-friends">
          <span className="input-label">Add friends to group</span>
        </div>
      </form>
    </div>
  )
}

export default NewGroup;