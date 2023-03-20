import './Dashboard.scss';
import Header from '../Header/Header';

const Dashboard = () => {
  return (
    <>
      <Header />
      <div className="heading">
        <h2>Dashboard</h2>
      </div>
      <div className="heading">
        <h2>Summary</h2>
      </div>
    </>
  )
}

export default Dashboard;