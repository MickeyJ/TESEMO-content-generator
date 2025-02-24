import { Link } from 'react-router-dom';
import Form from '../components/Form';

function Register() {
	return (
		<Form
			route="/api/user/register/"
			method="register"
			additionalRender={<Link className='text-primary hover:text-accent transition-colors duration-300' to="/login">Login</Link>}
		/>
	);
}

export default Register;
