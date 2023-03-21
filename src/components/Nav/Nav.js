import './Nav.scss';

const Nav = ({setExpenseOpen}) => {
  return (
    <div className="nav-container">
      <button type="button" className="add-button" onClick={() => setExpenseOpen(true)}><div className="add-plus"></div></button>
    </div>
  )
}

export default Nav;