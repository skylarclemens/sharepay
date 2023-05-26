import "./AddUsers.scss";
import { useEffect } from "react";
import UserButton from "../../../components/User/UserButton/UserButton";

const AddUsers = ({ label, account, usersList, setUsersList, selectedGroup, setOpenSelectPeople, removeGroupSelect }) => {
  useEffect(() => {
    setUsersList([account]);
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
                name={member?.name}
                variant="transparent"
              />
            )
          })}
          <button
            type="button"
            className="button--form-add button--icon"
            onClick={() => setOpenSelectPeople(true)}
            >
            <div className="add-plus"></div>
          </button>
          </>
        }
        {selectedGroup && 
          <div className="group-selected">
            <div className="group-name">{selectedGroup.group_name}</div>
            <button type="button" className="remove-group button--icon" onClick={removeGroupSelect}>x</button>
          </div>
        }
      </div>
    </div>
  )
}

export default AddUsers;