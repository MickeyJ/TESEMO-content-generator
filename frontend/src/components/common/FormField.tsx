import React from 'react';
import { FormChangeEvent } from '../../types/form';

interface Option {
	value: string;
	label: string;
}

interface FormFieldProps {
	label: string;
	name: string;
	type?: string;
	value: string;
	onChange: (e: FormChangeEvent) => void;
	error?: string;
	required?: boolean;
	placeholder?: string;
	options?: Option[];
}

export const FormField: React.FC<FormFieldProps> = ({
	label,
	name,
	type = 'text',
	value,
	onChange,
	error,
	required,
	placeholder,
	options
}) => {
	return (
		<div className="form-group">
			<label htmlFor={name}>
				{label}
				{required && <span className="required">*</span>}
			</label>
			{type === 'select' ? (
				<select
					id={name}
					name={name}
					value={value}
					onChange={onChange}
					className={error ? 'error' : ''}>
					<option value="">{placeholder || 'Select an option'}</option>
					{options?.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			) : type === 'textarea' ? (
				<textarea
					id={name}
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					className={error ? 'error' : ''}
				/>
			) : (
				<input
					id={name}
					name={name}
					type={type}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					className={error ? 'error' : ''}
				/>
			)}
			{error && <p className="form-error">{error}</p>}
		</div>
	);
};
