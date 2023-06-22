import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";

const TitleHeader = ({ title = " ", left, backButton, backFn, right, color, backgroundColor, className, ...props }) => {
  return (
    <Header
      type="title"
      className={className}
      color={color}
      backgroundColor={backgroundColor}
      left={backButton ? <BackButton backFn={backFn} /> : left}
      center={title}
      right={right}
      {...props}/>
  )
}

export default TitleHeader;

const BackButton = ({ backFn }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="arrow-container--back-arrow"
      title="Back button"
      alt="Back button"
      onClick={backFn || (() => navigate(-1))}>
        <div className="arrow arrow--left arrow--back-arrow arrow--white"></div>
    </button>
  )
}