import React from 'react';

interface User {
  id: number;
  name: string;
  surname?: string;
  email: string;
  createdAt: number;
  updatedAt: number;
}

interface AppProps {
  users: User[];
  totalCount: number;
  error: string | null;
}

export const App: React.FC<AppProps> = ({ users, totalCount, error }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>gRPC + NestJS + React SSR</title>
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <div id="root">
          <div className="container">
            <header className="header">
              <h1 className="title">🚀 gRPC + NestJS + React SSR</h1>
              <p className="subtitle">Modern SSR with NestJS, React, and gRPC</p>
            </header>

            {error && (
              <div className="error-banner">
                <p>⚠️ {error}</p>
              </div>
            )}

            <section className="content">
              <div className="users-header">
                <h2>Users</h2>
                <div className="badge">Total: {totalCount}</div>
              </div>

              {users.length === 0 && !error ? (
                <div className="empty-state">
                  <p>No users found. Start the Python gRPC service to see users!</p>
                </div>
              ) : (
                <div className="users-grid">
                  {users.map((user) => (
                    <div key={user.id} className="user-card">
                      <div className="user-header">
                        <div className="avatar">
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="user-info">
                          <h3>{user.name}</h3>
                          <p className="user-id">ID: {user.id}</p>
                        </div>
                      </div>

                      <div className="user-details">
                        <p className="detail">
                          📧 <span>{user.email || 'No email'}</span>
                        </p>
                        {user.surname && (
                          <p className="detail">
                            👤 <span>{user.surname}</span>
                          </p>
                        )}
                        <p className="detail timestamp">
                          Created:{' '}
                          {user.createdAt
                            ? new Date(Number(user.createdAt) * 1000).toLocaleDateString()
                            : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <footer className="footer">
              <p>
                Powered by <strong>NestJS</strong> + <strong>React SSR</strong> +{' '}
                <strong>gRPC</strong>
              </p>
              <p className="footer-note">
                Data fetched via gRPC from Python backend
              </p>
            </footer>
          </div>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Add hover effects and interactivity
              document.querySelectorAll('.user-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                  card.style.transform = 'translateY(-4px)';
                  card.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                });
                card.addEventListener('mouseleave', () => {
                  card.style.transform = 'translateY(0)';
                  card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                });
              });
            `,
          }}
        />
      </body>
    </html>
  );
};
