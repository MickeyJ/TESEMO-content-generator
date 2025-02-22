import { Link } from 'react-router-dom';
import Form from '../components/Form';

function Login() {
	return (
		<div className="">
			<Form
				route="/api/token/"
				method="login"
				additionalRender={<Link to="/register">Register</Link>}
			/>
		</div>
	);
}

export default Login;
