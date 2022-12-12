// see SignupForm.js for comments
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
	const [userFormData, setUserFormData] = useState({ email: '', password: '' });
	const [validated] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [login] = useMutation(LOGIN_USER);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setUserFormData({ ...userFormData, [name]: value });
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();

		// check if form has everything (as per react-bootstrap docs)
		const form = event.currentTarget;
		if (form.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		}

		try {
			const { data } = await login({
				variables: { ...userFormData },
			});

			Auth.login(data.login.token);
		} catch (err) {
			console.error(err);
			setShowAlert(true);
		}

		setUserFormData({
			username: '',
			email: '',
			password: '',
		});
	};

	return (
		<>
			<Form noValidate validated={validated} onSubmit={handleFormSubmit}>
				<Alert
					dismissible
					onClose={() => setShowAlert(false)}
					show={showAlert}
					variant="danger"
				>
					!!OOps Your login credentials are not correct
				</Alert>
				<Form.Group>
					<h3 className='mb-1'>Provide your login credentials</h3>
					<div class='small mb-3'>All the fields marked with star (<span className='text-danger'>*</span>) are required</div>
					<Form.Label htmlFor="email">Email <span className='text-danger'>*</span></Form.Label>
					<Form.Control
						type="text"
						placeholder="Your email"
						name="email"
						onChange={handleInputChange}
						value={userFormData.email}
						required
					/>
					<Form.Control.Feedback type="invalid">
						Email is required!
					</Form.Control.Feedback>
				</Form.Group>

				<Form.Group>
					<Form.Label htmlFor="password">Password <span className='text-danger'>*</span></Form.Label>
					<Form.Control
						type="password"
						placeholder="Your password"
						name="password"
						onChange={handleInputChange}
						value={userFormData.password}
						required
					/>
					<Form.Control.Feedback type="invalid">
						Password is required!
					</Form.Control.Feedback>
				</Form.Group>
				<Button
					disabled={!(userFormData.email && userFormData.password)}
					type="submit"
					variant="primary"
				>
					Submit
				</Button>
			</Form>
		</>
	);
};

export default LoginForm;
