import Button from '../UI/Buttons/Button/Button';
import './Modal.scss';

const Modal = ({ handleClose, open = false, children, style = {}, fullScreen = false }) => {
  return (
    open && (
      <div className={`modal ${fullScreen ? 'full-screen' : 'include-backdrop'}`}>
        <div style={style} className="modal-content">
          <Button variant="icon" className={`modal-close ${!handleClose ? 'hide-close' : ''}`} onClick={handleClose}>
            &times;
          </Button>
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
