import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users API:', error))
  }, [])

  return (
    <>
      <h3>🎮 ft_transcendence Frontend</h3>
      <div style={{ padding: "2rem", color: "#20ebd6ff", backgroundColor: "#082149ff", height: "100vh", width: "100%" }}>
      <h1>Frontend Service Tester</h1>
      <h2>Users:</h2>
      {users.length > 0 ? (
        <ul>
          {users.map((u) => (
            <li key={u.id}>{u.name}</li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
      <p className="read-the-docs">
        DevOps tester
      </p>
    </>
  )
}

export default App
