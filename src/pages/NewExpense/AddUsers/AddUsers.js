import "./AddUsers.scss";
import { useEffect } from "react";
import UserButton from "../../../components/User/UserButton/UserButton";
import Button from "../../../components/UI/Buttons/Button/Button";

const AddUsers = ({ label, account, usersList, setUsersList, selectedGroup, setOpenSelectPeople, removeGroupSelect }) => {
  useEffect(() => {
    setUsersList(usersList ? usersList : [account]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="add-users input-container">
      <span className="input-label">{label}</span>
      <div className="users-selected">
        {!selectedGroup && 
          <>
          {usersList.map(member => {
            return (
              <UserButton
                key={`${member?.id}-user-button`}
                user={member}
                name={member?.id === account?.id ? 'You' : member?.name}
                variant="transparent"
              />
            )
          })}
          <Button
            variant="icon"
            className="button--form-add"
            onClick={() => setOpenSelectPeople(true)}
            >
            <div className="add-plus"></div>
          </Button>
          </>
        }
        {selectedGroup && 
          <div className="group-selected">
            <div className="group-name">{selectedGroup.group_name}</div>
            <Button variant="icon" className="remove-group" onClick={removeGroupSelect}>x</Button>
          </div>
        }
      </div>
    </div>
  )
}

export default AddUsers;