import React, { useState } from 'react';
import api from '../api';
import { FormField } from './common/FormField';
import { validateForm, formValidationRules } from '../utils/formValidation';
import { FormChangeEvent } from '../types/form';

interface AuthorFormData {
	first_name: string;
	last_name: string;
	prompt: string;
	image_url: string;
	submit?: string;
}

interface CreateAuthorProps {
	onAuthorCreated: () => void;
}

const CreateAuthor: React.FC<CreateAuthorProps> = ({ onAuthorCreated }) => {
	const [formData, setFormData] = useState<AuthorFormData>({
		first_name: '',
		last_name: '',
		prompt: '',
		image_url: ''
	});
	const [errors, setErrors] = useState<Partial<AuthorFormData>>({});
	const [loading, setLoading] = useState(false);

	const handleChange = (e: FormChangeEvent) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		setErrors((prev) => ({
			...prev,
			[name]: '',
			submit: ''
		}));
	};

	const validateFormData = (): boolean => {
		const { isValid, errors } = validateForm(
			formData,
			formValidationRules.author
		);
		setErrors(errors);
		return isValid;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		if (!validateFormData()) {
			setLoading(false);
			return;
		}

		try {
			const response = await api.post('/api/authors/', formData);
			if (response.status === 201) {
				setFormData({
					first_name: '',
					last_name: '',
					prompt: '',
					image_url: ''
				});
				onAuthorCreated();
			} else {
				throw new Error('Failed to create author');
			}
		} catch (error: any) {
			setErrors((prev) => ({
				...prev,
				submit: error.response?.data?.message || 'Failed to create author'
			}));
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="form-container create-author-section">
			<h2 className="form-title">Create Author</h2>
			<form className="form" onSubmit={handleSubmit}>
				<FormField
					label="First Name"
					name="first_name"
					value={formData.first_name}
					onChange={handleChange}
					error={errors.first_name}
					placeholder="Enter first name"
					required
				/>

				<FormField
					label="Last Name"
					name="last_name"
					value={formData.last_name}
					onChange={handleChange}
					error={errors.last_name}
					placeholder="Enter last name"
					required
				/>

				<FormField
					label="Image URL"
					name="image_url"
					value={formData.image_url}
					onChange={handleChange}
					error={errors.image_url}
					placeholder="Enter image URL"
					required
				/>

				<FormField
					label="Prompt"
					name="prompt"
					type="textarea"
					value={formData.prompt}
					onChange={handleChange}
					error={errors.prompt}
					placeholder="Enter prompt details"
					required
				/>

				{errors.submit && <p className="form-error">{errors.submit}</p>}

				<button type="submit" className="form-submit" disabled={loading}>
					{loading ? 'Creating...' : 'Create Author'}
				</button>
			</form>
		</section>
	);
};

export default CreateAuthor;
