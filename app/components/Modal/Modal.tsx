import css from "./Modal.module.css";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
    
        document.addEventListener('keydown', handleKeydown);
        document.body.style.overflow = 'hidden';
    
        return () => {
            document.removeEventListener('keydown', handleKeydown);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const handleBacdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return createPortal(
        <div
            onClick={handleBacdropClick}
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
        >
            <div className={css.modal}>{children}</div>
        </div>,
        document.getElementById('modal-root') as HTMLDivElement
    );
}

