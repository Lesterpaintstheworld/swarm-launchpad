interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    animationDuration?: number;
}