import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, userRole } = useAuth();

  return (
    <div className="container">
      <div className="card">
        <h1>Welcome to Guess The Word</h1>
        <p>A fun word guessing game where you have 5 attempts to guess a 5-letter word!</p>
        
        {user ? (
          <div>
            <p>Welcome back, {user.email}!</p>
            <div className="home-buttons">
              <Link to="/dashboard" className="btn btn-primary">
                Play Game
              </Link>
              {userRole === 'admin' && (
                <Link to="/admin" className="btn btn-secondary">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="home-buttons">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        )}

        <div className="game-rules">
          <h3>How to Play:</h3>
          <ul>
            <li>Guess the 5-letter word in 5 attempts</li>
            <li>💚 Green: Correct letter in correct position</li>
            <li>🟡 Yellow: Correct letter in wrong position</li>
            <li>⚫ Gray: Letter not in the word</li>
            <li>Maximum 3 games per day</li>
            <li>Only uppercase letters allowed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;