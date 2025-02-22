import React, { useState, useEffect } from 'react';
import api from '../api';
import { FormField } from './common/FormField';
import { validateForm, formValidationRules } from '../utils/formValidation';
import { AuthorType } from './Author';
import { FormChangeEvent } from '../types/form';

interface ArticleFormData {
	headline: string;
	body: string;
	image_url: string;
	created_by: string;
	submit?: string;
}

interface CreateArticleProps {
	onArticleCreated: () => void;
}

const CreateArticle: React.FC<CreateArticleProps> = ({ onArticleCreated }) => {
	const [formData, setFormData] = useState<ArticleFormData>({
		headline: '',
		body: '',
		image_url: '',
		created_by: ''
	});
	const [errors, setErrors] = useState<Partial<ArticleFormData>>({});
	const [loading, setLoading] = useState(false);
	const [authors, setAuthors] = useState<AuthorType[]>([]);
	const [generating, setGenerating] = useState(false);

	useEffect(() => {
		getAuthors();
	}, []);

	const getAuthors = async () => {
		try {
			const response = await api.get('/api/authors/');
			setAuthors(response.data);
		} catch (error) {
			console.error('Failed to fetch authors:', error);
		}
	};

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
			formValidationRules.article
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
			const submitData = {
				...formData,
				created_by: parseInt(formData.created_by)
			};

			await api.post('/api/articles/', submitData);
			setFormData({
				headline: '',
				body: '',
				image_url: '',
				created_by: ''
			});
			onArticleCreated();
		} catch (error: any) {
			setErrors((prev) => ({
				...prev,
				submit: error.response?.data?.message || 'Failed to create article'
			}));
		} finally {
			setLoading(false);
		}
	};

	const handleGenerate = async (e: React.MouseEvent) => {
		e.preventDefault();
		console.log('Generate button clicked');

		// Clear any existing errors first
		setErrors({});

		if (!formData.created_by) {
			console.log('No author selected');
			setErrors({
				created_by: 'Please select an author first'
			});
			return;
		}

		console.log('Starting generation for author:', formData.created_by);
		setGenerating(true);
		try {
			console.log('Making API request...');
			const response = await api.get(
				`/api/articles/generate/${formData.created_by}/`
			);
			console.log('Generated article response:', response.data);
			const generatedArticle = response.data;

			setFormData({
				headline: generatedArticle.headline,
				body: generatedArticle.body,
				image_url: generatedArticle.image_url,
				created_by: formData.created_by
			});
		} catch (error: any) {
			console.error('Generation error:', error);
			setErrors({
				submit: error.response?.data?.message || 'Failed to generate article'
			});
		} finally {
			setGenerating(false);
		}
	};

	return (
		<section className="form-container create-article-section">
			<h2 className="form-title">Create Article</h2>
			<form className="form" onSubmit={handleSubmit}>
				<FormField
					label="Created By"
					name="created_by"
					type="select"
					value={formData.created_by}
					onChange={handleChange}
					error={errors.created_by}
					placeholder="Select an author"
					required
					options={authors.map((author) => ({
						value: author.id.toString(),
						label: `${author.first_name} ${author.last_name}`
					}))}
				/>

				<button
					type="button"
					className="form-submit"
					onClick={(e) => {
						console.log('Button clicked');
						handleGenerate(e);
					}}
					disabled={generating || !formData.created_by}>
					{generating ? 'Generating...' : 'Generate Article'}
				</button>

				<FormField
					label="Headline"
					name="headline"
					value={formData.headline}
					onChange={handleChange}
					error={errors.headline}
					placeholder="Enter headline"
					required
				/>

				<FormField
					label="Body"
					name="body"
					type="textarea"
					value={formData.body}
					onChange={handleChange}
					error={errors.body}
					placeholder="Enter article body"
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

				{errors.submit && <p className="form-error">{errors.submit}</p>}

				<button type="submit" className="form-submit" disabled={loading}>
					{loading ? 'Creating...' : 'Create Article'}
				</button>
			</form>
		</section>
	);
};

export default CreateArticle;
