import { useState, useEffect } from 'react'
import './App.css'

// Your live Railway API URL
const API_URL = 'https://viper-counter-backend-production.up.railway.app'

function App() {
  const [count, setCount] = useState(0)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch current count on component mount
  useEffect(() => {
    fetchCount()
    fetchHistory()
  }, [])

  // Fetch current count from API
  const fetchCount = async () => {
    try {
      const response = await fetch(`${API_URL}/api/count`)
      const data = await response.json()
      setCount(data.count)
    } catch (err) {
      setError('Failed to fetch count')
      console.error(err)
    }
  }

  // Fetch history from API
  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/history`)
      const data = await response.json()
      setHistory(data.history)
    } catch (err) {
      setError('Failed to fetch history')
      console.error(err)
    }
  }

  // Increment count
  const handleIncrement = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/api/count/increment`, {
        method: 'POST'
      })
      const data = await response.json()
      setCount(data.count)
      
      // Refresh history after increment
      fetchHistory()
    } catch (err) {
      setError('Failed to increment count')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <h1>🐍 ViPER Counter 🐍</h1>
      
      <div className="counter-display">
        <h2>Current Count: {count}</h2>
      </div>

      <button 
        onClick={handleIncrement} 
        disabled={loading}
        className="increment-button"
      >
        {loading ? 'Incrementing...' : 'Click to Increment'}
      </button>

      {error && <p className="error">{error}</p>}

      <div className="history">
        <h3>Last 10 Clicks:</h3>
        {history.length === 0 ? (
          <p>No history yet. Click the button!</p>
        ) : (
          <ul>
            {history.map((entry) => (
              <li key={entry.id}>
                Count: {entry.count} - {new Date(entry.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App