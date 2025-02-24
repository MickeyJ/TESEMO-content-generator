import { Link } from 'react-router-dom';
import Form from '../components/Form';

function Login() {
	return (
		<div className="">
			<Form
				route="/api/token/"
				method="login"
				additionalRender={<Link className='text-primary hover:text-accent transition-colors duration-300' to="/register">Register</Link>}
			/>
		</div>
	);
}

export default Login;
