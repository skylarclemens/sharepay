import './Modal.scss';

const Modal = ({ handleClose, open = false, children, style = {}, fullScreen = false }) => {
  return (
    open && (
      <div className={`modal ${fullScreen ? 'full-screen' : 'include-backdrop'}`}>
        <div style={style} className="modal-content">
          <button
            className={`button button--icon modal-close ${!handleClose ? 'hide-close' : ''}`}
            onClick={handleClose}
          >
            x
          </button>
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
