import { ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';

interface AuthedContainerType {
	pageComponent: ReactElement;
}

function AuthedContainer({ pageComponent }: AuthedContainerType) {
	const navigate = useNavigate();

	const logOut = () => {
		navigate('/login');
		localStorage.removeItem(REFRESH_TOKEN);
		localStorage.removeItem(ACCESS_TOKEN);
	}

	return (
		<>
			<header className="sticky top-0 flex justify-between p-4 border">
				<nav >
					<Link to="/">Articles</Link>
					<span className=""> | </span>
					<Link to="/authors">Authors</Link>
				</nav>
				<p className='text-primary hover:text-accent transition-colors duration-300 cursor-pointer' onClick={logOut}>
					Log Out
				</p>
			</header>
			<div className="container mx-auto px-4">{pageComponent}</div>
		</>
	);
}

export default AuthedContainer;
