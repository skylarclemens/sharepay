import Header from "../Header/Header";

const MainHeader = ({ title, right, rightFn, className, ...props }) => {
  return (
    <Header type="main" className={className} left={title} right={right} {...props} />
  )
}

export default MainHeader;