import Header from "../Header/Header";
import Button from "../../../UI/Buttons/Button/Button";
import { useNavigate } from "react-router-dom";

const MainHeader = ({ title, left, right, backButton, backFn, className, ...props }) => {
  return (
    <Header type="main"
      className={className}
      left={backButton ? <BackButton backFn={backFn} /> : left}
      center={title}
      right={right}
      {...props}
    />
  )
}

export default MainHeader;

const BackButton = ({ backFn }) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="icon"
      className="arrow-container--back-arrow"
      title="Back button"
      alt="Back button"
      onClick={backFn || (() => navigate(-1))}>
        <div className="arrow arrow--left arrow--back-arrow arrow--white"></div>
    </Button>
  )
}