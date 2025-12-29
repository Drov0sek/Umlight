import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from '../Modal.module.css'; // Подключаем CSS-модуль

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
};

export const Modal = ({
                          isOpen,
                          onClose,
                          title,
                          children,
                          actions,
                      }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null)

    // Блокировка скролла при открытии
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div ref={modalRef} className={styles.modal}>
                {/* Заголовок и кнопка закрытия */}
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <button onClick={onClose} className={styles.closeButton}>
                        ✕
                    </button>
                </div>

                {/* Контент */}
                <div className={styles.content}>{children}</div>

                {/* Кастомные действия (кнопки и т.д.) */}
                {actions && <div className={styles.actions}>{actions}</div>}
            </div>
        </div>,
        document.body
    );
};