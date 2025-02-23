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
	const inputClasses = `w-full p-3 border rounded-md
		focus:outline-none focus:ring-2 focus:ring-accent
		${error ? 'border-error' : 'border-complementary'}`;

	return (
		<div className="form-group">
			<label htmlFor={name} className="font-bold mb-2">
				{label}
				{required && <span className="text-error ml-1">*</span>}
			</label>
			{type === 'select' ? (
				<select
					id={name}
					name={name}
					value={value}
					onChange={onChange}
					className={inputClasses}>
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
					className={`${inputClasses} min-h-[150px] resize-y`}
				/>
			) : (
				<input
					id={name}
					name={name}
					type={type}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					className={inputClasses}
				/>
			)}
			{error && <p className="text-red">{error}</p>}
		</div>
	);
};
