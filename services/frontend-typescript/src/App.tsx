import { useState } from 'react'
import { UserList } from './components/UserList'
import { CreateUser } from './components/CreateUser'
import { UserDetails } from './components/UserDetails'
import { User } from './services/grpcClient'
import './App.css'

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'details'>('list')

  const handleUserCreated = (user: User) => {
    setRefreshTrigger(prev => prev + 1)
    setSelectedUser(user)
    setActiveTab('details')
  }

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setActiveTab('details')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 gRPC User Management</h1>
        <p>Frontend TypeScript → Python gRPC Backend</p>
      </header>

      <nav className="app-nav">
        <button 
          className={activeTab === 'list' ? 'active' : ''}
          onClick={() => setActiveTab('list')}
        >
          👥 Users
        </button>
        <button 
          className={activeTab === 'create' ? 'active' : ''}
          onClick={() => setActiveTab('create')}
        >
          ➕ Create
        </button>
        <button 
          className={activeTab === 'details' ? 'active' : ''}
          onClick={() => setActiveTab('details')}
        >
          🔍 Details
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'list' && (
          <UserList 
            onUserSelect={handleUserSelect}
            refreshTrigger={refreshTrigger}
          />
        )}
        
        {activeTab === 'create' && (
          <CreateUser onUserCreated={handleUserCreated} />
        )}
        
        {activeTab === 'details' && (
          <UserDetails user={selectedUser} />
        )}
      </main>

      <footer className="app-footer">
        <div className="connection-status">
          <span className="status-indicator">🟡</span>
          <span>Mock Mode (gRPC via REST proxy not configured)</span>
        </div>
        <div className="tech-stack">
          <span>React + TypeScript + Vite</span>
          <span>•</span>
          <span>Python gRPC Backend</span>
        </div>
      </footer>
    </div>
  )
}

export default App