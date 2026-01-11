'use client';

interface DeleteConfirmationModalProps {
  title: string;
  message: string;
  itemName?: string;
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({
  title,
  message,
  itemName,
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content modal-danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚠️ {title}</h2>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        <div className="modal-body">
          <p className="modal-message">{message}</p>
          {itemName && (
            <div className="danger-item-display">
              <strong>{itemName}</strong>
            </div>
          )}
          <p className="warning-text">
            This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button 
            className="btn-secondary" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            className="btn-danger" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
