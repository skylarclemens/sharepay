import './NewExpense.scss';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddNewExpenseMutation } from '../../slices/expenseSlice';
import { useAddNewDebtMutation } from '../../slices/debtSlice';
import { getAllGroupsUsers } from '../../services/groups';
import { useAddActivityMutation } from '../../slices/activityApi';
import { useNavigate } from 'react-router-dom';
import { useGetAccountQuery } from '../../slices/accountSlice';
import Modal from '../../components/Modal/Modal';
import SelectPeople from '../../components/SelectPeople/SelectPeople';
import NewExpenseDetails from './NewExpenseDetails/NewExpenseDetails';
import NewExpenseSplit from './NewExpenseSplit/NewExpenseSplit';
import MainHeader from '../../components/Layout/Headers/MainHeader/MainHeader';

const NewExpense = () => {
  const user = useSelector(state => state.auth.user);
  const {
    data: account,
    isSuccess: accountFetched
  } = useGetAccountQuery(user?.id);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitWith, setSplitWith] = useState([]);
  const [splitWithGroup, setSplitWithGroup] = useState(null);
  const [paidBy, setPaidBy] = useState(user?.id);
  const [split, setSplit] = useState('EQUAL');
  const [splitValues, setSplitValues] = useState({});
  const [page, setPage] = useState(1);
  const [fieldErrors, setFieldErrors] = useState({});
  const [openSelectPeople, setOpenSelectPeople] = useState(false);
  const [category, setCategory] = useState('GENERAL');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().substring(0, 10));

  const [addNewExpense, { isExpenseLoading }] = useAddNewExpenseMutation();
  const [addNewDebt, { isDebtLoading }] = useAddNewDebtMutation();
  const [addActivity, { isActivityLoading }] = useAddActivityMutation();

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    if (!fieldErrors.formValid || isExpenseLoading || isDebtLoading || isActivityLoading) return;

    const groupId = splitWithGroup?.id || null;

    let expenseData;
    const newExpense = {
      payer_id: paidBy,
      description: description,
      amount: amount,
      group_id: groupId,
      category: category,
      date: expenseDate,
    };

    try {
      [expenseData] = await addNewExpense(newExpense).unwrap();
    } catch (error) {
      console.error(error);
    }
    
    const newDebt = splitWith.filter(friend => !(friend.id === paidBy)).map(friend => {
      return {
        creditor_id: paidBy,
        debtor_id: friend.id,
        amount: splitValues[friend.id]?.amount || 0,
        expense_id: expenseData.id,
        group_id: groupId
      }
    });

    try {
      await addNewDebt(newDebt).unwrap();
    } catch (error) {
      console.error(error);
    }

    const newActivity = {
      user_id: user?.id,
      reference_id: expenseData.id,
      type: 'EXPENSE',
      action: 'CREATE',
    }

    try {
       await addActivity(newActivity).unwrap();
       navigate(`/expense/${expenseData.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = selected => {
    if (selected?.group_name) {
      setSplitWithGroup(selected);
      const groupsUsers = getAllGroupsUsers(selected.id);
      groupsUsers.then(res => {
        setSplitWith(res)
      });
      setOpenSelectPeople(false);
      return;
    }

    setSplitWith([account, ...selected]);
    setOpenSelectPeople(false);
  };

  const removeGroupSplit = () => {
    setSplitWithGroup(null);
    setSplitWith([account]);
  }

  return (
    <>
      <MainHeader
        title={page === 1 ? 'New expense' : description}
        backButton={true}
        backFn={page === 1 ? () => navigate(-1) : () => setPage(1)}
        className="header--transparent"
        color="#787878"
      />
      <div className="expense-container">
        <form className="expense-form" onSubmit={handleSubmit}>
          {page === 1 ? <NewExpenseDetails 
            description={description}
            setDescription={setDescription}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
            amount={amount}
            category={category}
            setCategory={setCategory}
            setAmount={setAmount}
            date={expenseDate}
            setDate={setExpenseDate}
            setPage={setPage}
          /> : null}
          {page === 2 ? <NewExpenseSplit
            account={account}
            accountFetched={accountFetched}
            amount={amount}
            paidBy={paidBy}
            setPaidBy={setPaidBy}
            splitWith={splitWith}
            setSplitWith={setSplitWith}
            splitWithGroup={splitWithGroup}
            split={split}
            setSplit={setSplit}
            splitValues={splitValues}
            setSplitValues={setSplitValues}
            removeGroupSplit={removeGroupSplit}
            setOpenSelectPeople={setOpenSelectPeople}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
            handleSubmit={handleSubmit}
          /> : null}
        </form>
      </div>
      <Modal open={openSelectPeople}>
        <SelectPeople handleAdd={handleAdd} setOpen={setOpenSelectPeople} showGroups={true} existingUsers={splitWith.slice(1)} />
      </Modal>
    </>
  );
};

export default NewExpense;
