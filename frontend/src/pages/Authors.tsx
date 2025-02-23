import { useState, useEffect } from 'react';
import Author, { AuthorType } from '../components/Author';
import CreateAuthor from '../components/CreateAuthor';
import api from '../api';

function Authors() {
	const [authors, setAuthors] = useState<AuthorType[]>([]);

	useEffect(() => {
		getAuthors();
	}, []);

	const getAuthors = () => {
		api
			.get('/api/authors/')
			.then((res) => res.data)
			.then((data) => {
				setAuthors(data);
				console.log('Authors:', data);
			})
			.catch((err) => alert(err));
	};

	const handleDelete = async (id: number) => {
		try {
			await api.delete(`/api/authors/delete/${id}/`);
			setAuthors(authors.filter((author) => Number(author.id) === id));
		} catch (error) {
			console.error('Failed to delete author:', error);
		}
	};

	return (
		<div className="author-page">
			{/* Create Author Section */}
			<CreateAuthor onAuthorCreated={() => getAuthors()} />

			{/* Author List Section */}
			<section className="author-list-section">
				<h2 className="section-title">Authors</h2>
				<div className="author-list">
					{authors.map((author) => (
						<Author key={author.id} author={author} onDelete={handleDelete} />
					))}
				</div>
			</section>
		</div>
	);
}

export default Authors;
