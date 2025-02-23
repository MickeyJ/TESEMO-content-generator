import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

interface AuthedContainerType {
	pageComponent: ReactElement;
}

function AuthedContainer({ pageComponent }: AuthedContainerType) {
	return (
		<>
			<header>
				<nav className="sticky top-0 flex p-4 border">
					<Link to="/">Articles</Link>
					<span className=""> | </span>
					<Link to="/authors">Authors</Link>
				</nav>
			</header>
			<div className="container mx-auto px-4">{pageComponent}</div>
		</>
	);
}

export default AuthedContainer;
