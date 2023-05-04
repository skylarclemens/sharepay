import './NewGroup.scss';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import TextInput from '../../components/Input/TextInput/TextInput';
import Modal from '../../components/Modal/Modal';
import SelectFriends from '../../components/SelectFriends/SelectFriends';
import UserButton from '../../components/User/UserButton/UserButton';
import { supabase } from '../../supabaseClient';
import { useGetAccountQuery } from '../../slices/accountSlice';

const NewGroup = () => {
  const user = useSelector(state => state.auth.user);
  const {
    data: account
  } = useGetAccountQuery(user?.id);
  
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState([{ ...account }]);
  const [openSelectFriends, setOpenSelectFriends] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef?.current?.click();
  }, [inputRef]);

  const handleSubmit = async e => {
    e.preventDefault();

    let groupData;
    const newGroup = {
      group_name: groupName,
    };

    try {
      const { data, error } = await supabase
        .from('group')
        .insert(newGroup)
        .select();
      if (error) throw error;
      groupData = data[0];
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
      const { error } = await supabase
        .from('user_group')
        .insert(newMembers)
        .select();
      if (error) throw error;
    } catch (error) {
      console.error(error);
    }

    navigate(-1);
  };

  const handleAddUser = friend => {
    setGroupMembers([...groupMembers, friend]);
    setOpenSelectFriends(false);
  };

  return (
    <>
      <Header type="title" title="Create group" />
      <div className="new-group-container">
        <form className="group-form" onSubmit={handleSubmit}>
          <TextInput
            className="group-spacing"
            name="name"
            label="Group name"
            value={groupName}
            ref={inputRef}
            onChange={e => setGroupName(e.target.value)}
          />
          <div className="add-friends input-container">
            <span className="input-label group-spacing">Group members</span>
            <div className="group-members">
              {groupMembers.map(member => {
                return (
                  <UserButton
                    key={member.id}
                    user={member}
                    name={member.name}
                    variant="white"
                  />
                );
              })}
              <button
                type="button"
                className="button--form-add button--icon"
                onClick={() => setOpenSelectFriends(true)}
              >
                <div className="add-plus"></div>
              </button>
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
      <Modal open={openSelectFriends}>
        <SelectFriends handleAdd={handleAddUser} />
      </Modal>
    </>
  );
};

export default NewGroup;
