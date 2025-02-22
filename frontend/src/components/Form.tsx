import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { FormField } from './common/FormField';
import { validateForm, formValidationRules } from '../utils/formValidation';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { FormChangeEvent } from '../types/form';

interface FormData {
	username: string;
	password: string;
	submit?: string;
}

interface FormProps {
	route: string;
	method: string;
	additionalRender: React.ReactElement | React.ReactElement[];
}

const Form: React.FC<FormProps> = ({ route, method, additionalRender }) => {
	const [formData, setFormData] = useState<FormData>({
		username: '',
		password: ''
	});
	const [errors, setErrors] = useState<Partial<FormData>>({});
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	const name = method === 'login' ? 'Login' : 'Register';

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
			formValidationRules.auth
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
			const res = await api.post(route, formData);
			if (method === 'login') {
				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
				navigate('/');
			} else {
				navigate('/login');
			}
		} catch (error: any) {
			setErrors((prev) => ({
				...prev,
				submit: error.response?.data?.message || 'An error occurred'
			}));
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="form-container auth-form-section">
			<h2 className="form-title">{name}</h2>
			<form className="form" onSubmit={handleSubmit}>
				<FormField
					label="Username"
					name="username"
					value={formData.username}
					onChange={handleChange}
					error={errors.username}
					placeholder="Enter username"
					required
				/>

				<FormField
					label="Password"
					name="password"
					type="password"
					value={formData.password}
					onChange={handleChange}
					error={errors.password}
					placeholder="Enter password"
					required
				/>

				{errors.submit && <p className="form-error">{errors.submit}</p>}

				<button type="submit" className="form-submit" disabled={loading}>
					{loading ? 'Loading...' : name}
				</button>
			</form>
			<div className="form-additional">{additionalRender}</div>
		</section>
	);
};

export default Form;
