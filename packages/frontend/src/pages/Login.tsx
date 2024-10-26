import React, { useState } from 'react';
import { Button, Input, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { postLogin } from '../api/login';

const Login: React.FC = () => {
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const token = await postLogin(password);
            dispatch(login(token));
            navigate('/specialties'); // Redirect to the specialties page on successful login
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <Form onFinish={handleLogin}>
                <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
                    <Input.Password
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    Login
                </Button>
            </Form>
        </div>
    );
};

export default Login;
