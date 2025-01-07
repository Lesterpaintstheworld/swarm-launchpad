'use client'

import { X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef } from "react"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    animationDuration?: number;
}

const Modal = ({ isOpen, onClose, children, animationDuration }: ModalProps) => {

    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.focus()
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{
                        pointerEvents: isOpen ? 'auto' : 'none',
                        cursor: isOpen ? undefined : 'default'
                    }}
                    role="dialog"
                    aria-modal="true"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: animationDuration ?? 0.3 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                        onClick={isOpen ? onClose : undefined}
                    />
                    <motion.div
                        ref={modalRef}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="relative z-50 w-fit min-w-96 max-w-lg rounded-lg bg-popover border border-border p-3 shadow-xl"
                        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                        tabIndex={-1}
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-foreground hover:text-muted"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                        {children}
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    )
};

export { Modal };
export type { ModalProps };