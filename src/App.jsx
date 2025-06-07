import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // <-- Importante
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate() // <-- Hook para redireccionar

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="mb-4 w-full justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          El contador es {count}
        </button>
        <button 
          onClick={() => navigate('/login')}
          className="w-full justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          Ir al login
        </button>
        <p className="mt-4">
          Edita <code>src/App.jsx</code> y guarda para probar HMR
        </p>
      </div>
      <p className="read-the-docs">
        Haz click en los logos de Vite y React para aprender más
      </p>
    </div>
  )
}

export default App
