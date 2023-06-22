import Header from "../Header/Header"

const TitleHeader = ({ title, left, right, color, backgroundColor, className, ...props }) => {
  return (
    <Header type="title" className={className} color={color} backgroundColor={backgroundColor} left={left} center={title} right={right} {...props}/>
  )
}

export default TitleHeader;