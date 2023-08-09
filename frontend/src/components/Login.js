import Sign from './Sign';

function Login({ onSubmit, title, buttonName, linkText, linkTo }) {
	return (
		<Sign
			onSubmit={onSubmit}
			title={title}
			buttonName={buttonName}
			linkText={linkText}
			linkTo={linkTo}
		/>
	);
}

export default Login;
