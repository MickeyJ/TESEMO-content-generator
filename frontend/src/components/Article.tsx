import React from 'react';
import { AuthorType } from './Author';
import api from '../api'; // Import your api config
import { Link } from 'react-router-dom';

export interface ArticleType {
	id: number;
	headline: string;
	body: string;
	created_at: string;
	created_by: number;
	image_url: string;
	author: AuthorType | null;
}

interface ArticleProps {
	article: ArticleType;
}

const Article: React.FC<ArticleProps> = ({ article }) => {
	const formattedDate = new Date(article.created_at).toLocaleDateString(
		'en-US',
		{
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}
	);

	// Truncate body text to 150 characters
	const truncatedBody =
		article.body.length > 150
			? `${article.body.substring(0, 150)}...`
			: article.body;

	return (
		<article className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
			<Link to={`/articles/${article.id}`} className="flex-1">
				<img
					src={`${api.defaults.baseURL}${article.image_url}`}
					alt={article.headline}
					className="w-full aspect-square object-cover"
				/>
				<div className="p-4">
					<h2 className="text-xl font-bold mb-2 line-clamp-2">
						{article.headline}
					</h2>
					<p className="text-gray-600 mb-4 line-clamp-3">{truncatedBody}</p>
					<span className="text-primary hover:text-accent transition-colors duration-300">
						Continue reading →
					</span>
				</div>
			</Link>
		</article>
	);
};

export default Article;
