import { ReactElement } from 'react';
import { Link } from 'react-router';

interface AuthedContainerType {
	pageComponent: ReactElement;
}

function AuthedContainer({ pageComponent }: AuthedContainerType) {
	return (
		<>
			<nav>
				<Link to="/">Articles</Link>
				<span> | </span>
				<Link to="/authors">Authors</Link>
			</nav>
			<div className="container">{pageComponent}</div>
		</>
	);
}

export default AuthedContainer;
