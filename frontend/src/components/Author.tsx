import '../styles/Author.scss';

export interface AuthorType {
	id: string;
	first_name: string;
	last_name: string;
	image_url: string;
	prompt: string;
	created_by: string;
	created_at: string;
}

interface AuthorProps {
	author: AuthorType;
	onDelete: Function;
}

function Author({ author, onDelete }: AuthorProps) {
	const formattedDate = new Date(author.created_at).toLocaleDateString('en-US');

	return (
		<article className="author">
			<header className="author-header">
				<img
					src={author.image_url}
					alt={`${author.first_name} ${author.last_name}`}
					className="author-image"
				/>
				<h3 className="author-name">{`${author.first_name} ${author.last_name}`}</h3>
			</header>
			<section className="author-content">
				<p className="author-prompt">{author.prompt}</p>
				<p className="author-created-by">Created by: {author.created_by}</p>
			</section>
			<footer className="author-footer">
				<p className="author-date">{formattedDate}</p>
				<button className="delete-button" onClick={() => onDelete(author.id)}>
					Delete
				</button>
			</footer>
		</article>
	);
}

export default Author;
