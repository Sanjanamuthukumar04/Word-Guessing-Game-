import React from 'react';
import { useAuth } from '../context/AuthContext';
import Game from '../components/Game/Game';

const Dashboard = () => {
  const { user, userRole, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1>Guess The Word</h1>
          <div className="nav-user">
            <span>Welcome!</span>
            <button onClick={handleSignOut} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <Game />
    </div>
  );
};

export default Dashboard;