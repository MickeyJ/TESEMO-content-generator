import React from 'react';

interface ConfirmDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
				<h2 className="text-xl font-bold mb-4">{title}</h2>
				<p className="text-gray-600 mb-6">{message}</p>
				<div className="flex justify-end space-x-4">
					<button onClick={onClose} className="btn2">
						Cancel
					</button>
					<button onClick={onConfirm} className="btn-warn">
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDialog;
