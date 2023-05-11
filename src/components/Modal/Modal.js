import './Modal.scss';

const Modal = ({ handleClose, open = false, children, fullPage = false }) => {
  return (
    open && (
      <div className={`modal ${fullPage ? 'full-page' : 'include-backdrop'}`}>
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
