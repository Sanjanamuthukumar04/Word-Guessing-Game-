import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../services/supabase.jsx';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('daily');
  const [dailyReport, setDailyReport] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (activeTab === 'daily') {
      loadDailyReport();
    } else {
      loadUserReports();
    }
  }, [activeTab, selectedDate]);

  const loadDailyReport = async () => {
    setLoading(true);
    try {
      // Get game sessions for the selected date
      const { data: gamesData, error } = await supabase
        .from('game_sessions')
        .select('user_id, is_win, created_at')
        .gte('created_at', `${selectedDate}T00:00:00`)
        .lte('created_at', `${selectedDate}T23:59:59`);

      if (error) throw error;

      // Process the data
      const uniqueUsers = new Set(gamesData?.map(game => game.user_id) || []);
      const correctGuesses = gamesData?.filter(game => game.is_win === true).length || 0;

      setDailyReport({
        total_users: uniqueUsers.size,
        total_games: gamesData?.length || 0,
        correct_guesses: correctGuesses
      });

    } catch (error) {
      console.error('Error loading daily report:', error);
      alert('Error loading daily report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserReports = async () => {
    setLoading(true);
    try {
      // Get game sessions with user info
      const { data: gamesData, error } = await supabase
        .from('game_sessions')
        .select(`
          user_id,
          is_win,
          created_at,
          users (username, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process data by user and date
      const userStats = {};
      
      gamesData?.forEach(game => {
        const date = game.created_at.split('T')[0];
        const userId = game.user_id;
        const key = `${userId}-${date}`;
        
        if (!userStats[key]) {
          userStats[key] = {
            username: game.users?.username || game.users?.email || 'Unknown',
            date: date,
            games_played: 0,
            wins: 0
          };
        }
        
        userStats[key].games_played++;
        if (game.is_win) {
          userStats[key].wins++;
        }
      });

      setUserReports(Object.values(userStats));

    } catch (error) {
      console.error('Error loading user reports:', error);
      alert('Error loading user reports: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <div className="nav-content">
          <h1>Admin Panel - Guess The Word</h1>
          <div className="nav-user">
            <span>Admin: {user.email}</span>
           
            <button onClick={handleSignOut} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="admin-content">
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            Daily Report
          </button>
          <button 
            className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            User Reports
          </button>
        </div>

        {activeTab === 'daily' && (
          <div className="daily-report">
            <div className="report-header">
              <h2>Daily Report</h2>
              <div className="date-selector">
                <label>Select Date: </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            
            {loading ? (
              <div className="loading">Loading report...</div>
            ) : dailyReport ? (
              <div className="report-cards">
                <div className="report-card">
                  <h3>Total Users Played</h3>
                  <div className="stat-number">{dailyReport.total_users}</div>
                </div>
                <div className="report-card">
                  <h3>Total Games Played</h3>
                  <div className="stat-number">{dailyReport.total_games}</div>
                </div>
                <div className="report-card">
                  <h3>Correct Guesses</h3>
                  <div className="stat-number">{dailyReport.correct_guesses}</div>
                </div>
                <div className="report-card">
                  <h3>Success Rate</h3>
                  <div className="stat-number">
                    {dailyReport.total_games > 0 
                      ? `${((dailyReport.correct_guesses / dailyReport.total_games) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-data">No data available for selected date</div>
            )}
          </div>
        )}

        {activeTab === 'user' && (
          <div className="user-reports">
            <h2>User Reports</h2>
            {loading ? (
              <div className="loading">Loading user reports...</div>
            ) : userReports.length > 0 ? (
              <div className="reports-table-container">
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Date</th>
                      <th>Games Played</th>
                      <th>Wins</th>
                      <th>Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userReports.map((report, index) => (
                      <tr key={index}>
                        <td>{report.username}</td>
                        <td>{new Date(report.date).toLocaleDateString()}</td>
                        <td>{report.games_played}</td>
                        <td>{report.wins}</td>
                        <td>
                          {report.games_played > 0 
                            ? `${((report.wins / report.games_played) * 100).toFixed(1)}%`
                            : '0%'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">No user reports available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};


export default AdminPanel;
