import { useEffect } from "react";
import UserButton from "../../../components/User/UserButton/UserButton";

const SplitWith = ({ account, splitWith, setSplitWith, splitWithGroup, setOpenSelectPeople, removeGroupSplit }) => {
  useEffect(() => {
    setSplitWith([account]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="split-with-container">
      <span className="input-label">Split between</span>
      <div className="split-with">
        {!splitWithGroup && 
          <>
          {splitWith.map(member => {
            return (
              <UserButton
                key={member?.id}
                user={member}
                name={member?.name}
                variant="white"
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
        {splitWithGroup && 
          <div className="group-selected">
            <div className="group-name">{splitWithGroup.group_name}</div>
            <button type="button" className="remove-group button--icon" onClick={removeGroupSplit}>x</button>
          </div>
        }
      </div>
    </div>
  )
}

export default SplitWith;