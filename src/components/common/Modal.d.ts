import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: string;
    showCloseButton?: boolean;
    headerVariant?: 'orange' | 'simple';
}

declare const Modal: React.FC<ModalProps>;
export default Modal;
