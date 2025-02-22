import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import AuthedContainer from './AuthedContainer';

interface ProtectedRouteProps {
	children: any;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
	const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

	useEffect(() => {
		auth().catch((err) => {
			console.log('ProtectedRoute useEffect() auth() catch error', err);

			setIsAuthorized(false);
		});
	}, []);

	const refreshToken = async () => {
		const refreshToken = localStorage.getItem(REFRESH_TOKEN);
		try {
			const res = await api.post('/api/token/refresh/', {
				refresh: refreshToken
			});

			if (res.status === 200) {
				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				setIsAuthorized(true);
			} else {
				console.log('ProtectedRoute refreshToken() bad status', res.status);
				console.log(res.data);

				setIsAuthorized(false);
			}
		} catch (error) {
			console.log('ProtectedRoute refreshToken() catch error', error);
			setIsAuthorized(false);
		}
	};

	const auth = async () => {
		const token = localStorage.getItem(ACCESS_TOKEN);
		if (!token) {
			setIsAuthorized(false);
			console.log('ProtectedRoute auth() no token');
			return;
		}

		const decoded = jwtDecode(token);
		const tokenExpiration = decoded.exp || 0;
		const now = Date.now() / 1000;

		if (tokenExpiration < now) {
			await refreshToken();
		} else {
			setIsAuthorized(true);
		}
	};

	if (isAuthorized === null) {
		return <div>Loading...</div>;
	}

	return isAuthorized ? (
		<AuthedContainer pageComponent={children} />
	) : (
		<Navigate to="/login" />
	);
}

export default ProtectedRoute;
