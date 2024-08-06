import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import the CSS file for styling

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Added error state
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', 
                { username, password }, 
                { withCredentials: true } 
            );
            if (response.data.success) { // Check for success property in response
                navigate('/');
            } else {
                setError('Login failed: ' + response.data.message); // Set error message
            }
        } catch (error) {
            setError('Login failed: ' + (error.response ? error.response.data : error.message));
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input 
                        id="username" // Added id attribute
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        id="password" // Added id attribute
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Login</button>
                {error && <p className="error-message">{error}</p>} {/* Display error message */}
            </form>
            <p>Not registered? <a href="/register">Create an account</a></p>
        </div>
    );
};

export default Login;
