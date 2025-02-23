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

	return (
		<div className="container mx-auto px-4">
			<CreateArticle onArticleCreated={fetchArticles} />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
				{articles.map((article) => (
					<Article key={article.id} article={article} />
				))}
			</div>
		</div>
	);
};

export default Home;
