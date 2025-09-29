import React, { useState } from 'react';
import { grpcClient, User } from '../services/grpcClient';

interface CreateUserProps {
  onUserCreated?: (user: User) => void;
}

export const CreateUser: React.FC<CreateUserProps> = ({ onUserCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const newUser = await grpcClient.createUser({
        name: name.trim(),
        email: email.trim(),
      });

      setSuccess(`✅ User "${newUser.name}" created successfully!`);
      setName('');
      setEmail('');
      onUserCreated?.(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user">
      <h2>➕ Create New User</h2>
      
      <form onSubmit={handleSubmit} className="create-user-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter user name"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            disabled={loading}
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || !name.trim() || !email.trim()}
        >
          {loading ? '⏳ Creating...' : '✨ Create User'}
        </button>
      </form>

      {error && (
        <div className="message error">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="message success">
          {success}
        </div>
      )}
    </div>
  );
};