import Header from "../Header/Header";

const TitleHeader = ({ title, left, backFn, right, color, backgroundColor, className, ...props }) => {
  return (
    <Header
      type="title"
      className={className}
      color={color}
      backgroundColor={backgroundColor}
      left={left ? left : <BackButton backFn={backFn} />}
      center={title}
      right={right}
      {...props}/>
  )
}

export default TitleHeader;

const BackButton = ({ backFn }) => {
  return (
    <button
      type="button"
      className="arrow-container--back-arrow"
      title="Back button"
      alt="Back button"
      onClick={backFn}>
        <div className="arrow arrow--left arrow--back-arrow arrow--white"></div>
    </button>
  )
}