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
		<article className="">
			<header className="">
				<img
					src={author.image_url}
					alt={`${author.first_name} ${author.last_name}`}
					className=""
				/>
				<h3 className="">{`${author.first_name} ${author.last_name}`}</h3>
			</header>
			<section className="">
				<p className="">{author.prompt}</p>
				<p className="">Created by: {author.created_by}</p>
			</section>
			<footer className="">
				<p className="">{formattedDate}</p>
				<button className="" onClick={() => onDelete(author.id)}>
					Delete
				</button>
			</footer>
		</article>
	);
}

export default Author;
