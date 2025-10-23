import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className={`relative bg-card border border-border shadow-lg w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
            >
                <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

export function InfoModal({ isOpen, onClose, title, message }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p className="text-muted-foreground mb-4">{message}</p>
            <Button onClick={onClose} className="w-full">
                OK
            </Button>
        </Modal>
    );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p className="text-muted-foreground mb-4">{message}</p>
            <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                </Button>
                <Button onClick={onConfirm} className="flex-1">
                    Confirm
                </Button>
            </div>
        </Modal>
    );
}
