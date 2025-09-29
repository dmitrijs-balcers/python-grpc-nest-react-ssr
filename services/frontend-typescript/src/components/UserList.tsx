import React, { useState, useEffect } from 'react';
import { grpcClient, User } from '../services/grpcClient';

interface UserListProps {
  onUserSelect?: (user: User) => void;
  refreshTrigger?: number;
}

export const UserList: React.FC<UserListProps> = ({ onUserSelect, refreshTrigger }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await grpcClient.listUsers({ page, page_size: pageSize });
      setUsers(response.users);
      setTotalCount(response.total_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, refreshTrigger]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading) {
    return (
      <div className="user-list">
        <h2>👥 Users</h2>
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list">
        <h2>👥 Users</h2>
        <div className="error">
          ❌ Error: {error}
          <button onClick={loadUsers} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list">
      <div className="header">
        <h2>👥 Users ({totalCount} total)</h2>
        <button onClick={loadUsers} className="refresh-btn">🔄 Refresh</button>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          No users found. Create your first user!
        </div>
      ) : (
        <>
          <div className="users-grid">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="user-card"
                onClick={() => onUserSelect?.(user)}
              >
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p className="email">📧 {user.email}</p>
                  <p className="id">ID: {user.id}</p>
                  <p className="timestamp">Created: {formatTimestamp(user.created_at)}</p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};