import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { ArticleType } from '../components/Article';
import { FormField } from '../components/common/FormField';
import { FormChangeEvent } from '../types/form';
import ConfirmDialog from '../components/common/ConfirmDialog';

const ArticlePage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [article, setArticle] = useState<ArticleType | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState<Partial<ArticleType>>({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	useEffect(() => {
		fetchArticle();
	}, [id]);

	const fetchArticle = async () => {
		try {
			const response = await api.get(`/api/articles/${id}/`);
			setArticle(response.data);
			setEditForm(response.data);
		} catch (error) {
			console.error('Failed to fetch article:', error);
			setError('Failed to load article');
		}
	};

	const handleChange = (e: FormChangeEvent) => {
		const { name, value } = e.target;
		setEditForm((prev) => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			// Only send headline and body for update
			const updateData = {
				headline: editForm.headline,
				body: editForm.body
			};

			const response = await api.put(`/api/articles/update/${id}/`, updateData);
			setArticle(response.data);
			setIsEditing(false);
		} catch (error) {
			console.error('Failed to update article:', error);
			setError('Failed to update article');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			await api.delete(`/api/articles/delete/${id}/`);
			navigate('/');
		} catch (error) {
			console.error('Failed to delete article:', error);
			setError('Failed to delete article');
		}
	};

	if (!article) {
		return <div>Loading...</div>;
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="flex mb-6">
				<button onClick={() => navigate(-1)} className="btn2">
					Back
				</button>
				<div className="flex">
					<button onClick={() => setIsEditing(!isEditing)} className="btn1">
						{isEditing ? 'Cancel Edit' : 'Edit Article'}
					</button>
					<button onClick={() => setIsConfirmOpen(true)} className="btn-warn">
						Delete Article
					</button>
				</div>
			</div>

			{isEditing ? (
				<form onSubmit={handleSubmit} className="space-y-6">
					<FormField
						label="Headline"
						name="headline"
						value={editForm.headline || ''}
						onChange={handleChange}
						required
					/>

					<FormField
						label="Body"
						name="body"
						type="textarea"
						value={editForm.body || ''}
						onChange={handleChange}
						required
					/>

					{error && <p className="text-error">{error}</p>}

					<button
						className="btn2"
						onClick={() => {
							setIsEditing(false);
							setError('');
						}}>
						Cancel
					</button>
					<button type="submit" className="btn1" disabled={loading}>
						{loading ? 'Saving...' : 'Save Changes'}
					</button>
				</form>
			) : (
				<article className="prose lg:prose-xl">
					<img
						src={`${api.defaults.baseURL}${article.image_url}`}
						alt={article.headline}
						className="w-full h-64 object-cover rounded-lg mb-6"
					/>
					<h1 className="text-4xl font-bold mb-4">{article.headline}</h1>
					<p className="whitespace-pre-wrap">{article.body}</p>

					<div className="mt-6 text-sm text-gray-500">
						<p>Created by: {article.created_by}</p>
						<p>
							Author:{' '}
							{article.author &&
								`${article.author.first_name} ${article.author.last_name}`}
						</p>
						<p>Created: {new Date(article.created_at).toLocaleDateString()}</p>
					</div>
				</article>
			)}

			<ConfirmDialog
				isOpen={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={() => {
					handleDelete();
					setIsConfirmOpen(false);
				}}
				title="Delete Article"
				message="Are you sure you want to delete this article? This action cannot be undone."
			/>
		</div>
	);
};

export default ArticlePage;
