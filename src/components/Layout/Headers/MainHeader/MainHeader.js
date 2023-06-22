import Header from "../Header/Header";

const MainHeader = ({ title, right, rightFn, className, ...props }) => {
  return (
    <Header type="main" className={className} backgroundColor={'#729B79'} left={title} right={right} {...props} />
  )
}

export default MainHeader;