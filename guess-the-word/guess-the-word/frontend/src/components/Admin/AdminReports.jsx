import React from 'react';
import './AdminReports.css';

const AdminReports = ({ reports }) => {
  if (!reports || reports.length === 0) {
    return <div className="no-reports">No reports available</div>;
  }

  return (
    <div className="admin-reports">
      <div className="reports-grid">
        {reports.map((report, index) => (
          <div key={index} className="report-item">
            <h3>{report.username}</h3>
            <div className="report-stats">
              <div className="stat">
                <span className="label">Games Played:</span>
                <span className="value">{report.games_played}</span>
              </div>
              <div className="stat">
                <span className="label">Wins:</span>
                <span className="value">{report.wins}</span>
              </div>
              <div className="stat">
                <span className="label">Win Rate:</span>
                <span className="value">
                  {report.games_played > 0 
                    ? `${((report.wins / report.games_played) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;