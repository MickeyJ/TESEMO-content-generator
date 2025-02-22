import React from 'react';
import '../styles/Article.scss';
import { AuthorType } from './Author';

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
	onDelete: (id: number) => void;
}

const Article: React.FC<ArticleProps> = ({ article, onDelete }) => {
	const formattedDate = new Date(article.created_at).toLocaleDateString(
		'en-US',
		{
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}
	);

	return (
		<article className="article">
			<header className="article-header">
				<img
					src={article.image_url}
					alt={article.headline}
					className="article-image"
				/>
				<h3 className="article-headline">{article.headline}</h3>
			</header>
			<section className="article-content">
				<p className="article-body">{article.body}</p>
			</section>
			<footer className="article-footer">
				<p className="article-created-by">Created by: {article.created_by}</p>
				<p className="article-author">
					Author:{' '}
					{article.author &&
						`${article.author.first_name} ${article.author.last_name}`}
				</p>
				<p className="article-date">{formattedDate}</p>
				<button
					className="delete-button"
					onClick={() => onDelete(article.id)}
					type="button">
					Delete
				</button>
			</footer>
		</article>
	);
};

export default Article;
