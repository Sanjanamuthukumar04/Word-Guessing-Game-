import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminAttempt, setIsAdminAttempt] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleRegularLogin = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      setIsAdminAttempt(false);
      await signIn(email, password, false);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      setIsAdminAttempt(true);
      await signIn(email, password, true);
      navigate('/admin');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Guess The Word</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
          />
        </div>
        
        <button 
          onClick={handleRegularLogin}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading && !isAdminAttempt ? 'Logging in...' : 'Login'}
        </button>

        <button 
          onClick={handleAdminLogin}
          disabled={loading}
          className="btn btn-admin"
        >
          {loading && isAdminAttempt ? 'Logging in...' : 'Admin Login'}
        </button>
        
        <div className="login-links">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;