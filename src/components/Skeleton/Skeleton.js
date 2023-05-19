import './Skeleton.scss';

const Skeleton = ({ children, height = 100, width = 30, classes }) => {
  return (
    <div style={{
      height: height,
      width: width,
      borderRadius: '0.5rem',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    }} className={`skeleton loading animation--loading ${classes}`}>
      {children}
    </div>
  )
}

export default Skeleton;