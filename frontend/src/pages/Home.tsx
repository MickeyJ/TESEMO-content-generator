import React, { useEffect, useState } from 'react';
import api from '../api';
import Article, { ArticleType } from '../components/Article';
import CreateArticle from '../components/CreateArticle';

const Home: React.FC = () => {
	const [articles, setArticles] = useState<ArticleType[]>([]);

	const fetchArticles = async () => {
		try {
			const response = await api.get('/api/articles/');
			setArticles(response.data);
		} catch (error) {
			console.error('Failed to fetch articles:', error);
		}
	};

	useEffect(() => {
		fetchArticles();
	}, []);

	const handleDelete = async (id: number) => {
		try {
			await api.delete(`/api/articles/delete/${id}/`);
			setArticles(articles.filter((article) => Number(article.id) !== id));
		} catch (error) {
			console.error('Failed to delete article:', error);
		}
	};

	return (
		<div className="home">
			<CreateArticle onArticleCreated={fetchArticles} />
			<div className="flex flex-col items-center">
				{articles.map((article) => (
					<Article key={article.id} article={article} onDelete={handleDelete} />
				))}
			</div>
		</div>
	);
};

export default Home;
