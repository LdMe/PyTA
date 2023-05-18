
import './Modal.scss';

const Modal = ({ children, show, onClose }) => {
    const showHideClassName = show ? 'modal show' : 'modal';
    return (
        <div className={showHideClassName}>
        <section className='modal-content'>
            {children}
        </section>
        </div>
    );
};

export default Modal;