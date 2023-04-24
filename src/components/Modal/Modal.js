import './Modal.scss';

const Modal = ({ handleClose, open = false, children }) => {
  return (
    open && (
      <div className="modal">
        <div className="modal-content">
          <button
            className={`button modal-close ${!handleClose && 'hide-close'}`}
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
