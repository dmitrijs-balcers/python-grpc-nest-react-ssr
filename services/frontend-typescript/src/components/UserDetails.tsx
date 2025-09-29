import React, { useState, useEffect } from 'react';
import { grpcClient, User } from '../services/grpcClient';

interface UserDetailsProps {
  userId?: number;
  user?: User | null;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ userId, user: initialUser }) => {
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchId, setSearchId] = useState(userId?.toString() || '');

  const loadUser = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUser = await grpcClient.getUser({ user_id: id });
      setUser(fetchedUser);
      if (!fetchedUser) {
        setError(`User with ID ${id} not found`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && !initialUser) {
      loadUser(userId);
    }
  }, [userId, initialUser]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(searchId);
    if (isNaN(id) || id <= 0) {
      setError('Please enter a valid user ID');
      return;
    }
    loadUser(id);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="user-details">
      <h2>🔍 User Details</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-group">
          <input
            type="number"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter User ID"
            min="1"
          />
          <button type="submit" disabled={loading}>
            {loading ? '⏳' : '🔍'} Search
          </button>
        </div>
      </form>

      {loading && (
        <div className="loading">Loading user details...</div>
      )}

      {error && (
        <div className="error">
          ❌ {error}
        </div>
      )}

      {user && !loading && (
        <div className="user-detail-card">
          <div className="detail-header">
            <h3>{user.name}</h3>
            <span className="user-id">ID: {user.id}</span>
          </div>
          
          <div className="detail-content">
            <div className="detail-item">
              <label>📧 Email:</label>
              <span>{user.email}</span>
            </div>
            
            <div className="detail-item">
              <label>📅 Created:</label>
              <span>{formatTimestamp(user.created_at)}</span>
            </div>
            
            <div className="detail-item">
              <label>🔄 Updated:</label>
              <span>{formatTimestamp(user.updated_at)}</span>
            </div>
          </div>

          <div className="detail-actions">
            <button 
              onClick={() => loadUser(user.id)}
              className="refresh-btn"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      )}

      {!user && !loading && !error && (
        <div className="empty-state">
          Enter a user ID above to view details, or select a user from the list.
        </div>
      )}
    </div>
  );
};