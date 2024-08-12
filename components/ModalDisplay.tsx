import React from 'react';
import ReactDOM from 'react-dom';
import styles from '@/components/modal.module.css'; // Add your styles here

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2  className='text-black uppercase w-full text-xl md:text-3xl lg:text-2xl font-playfair font-bold mb-8 text-center'>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
