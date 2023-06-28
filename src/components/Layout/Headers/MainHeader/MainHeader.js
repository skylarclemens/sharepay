import Header from "../Header/Header";

const MainHeader = ({ title, left, right, className, ...props }) => {
  return (
    <Header type="main" className={className} left={left} center={title} right={right} {...props} />
  )
}

export default MainHeader;