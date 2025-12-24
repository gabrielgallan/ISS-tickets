import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import PageRouter from './pages/PageRouter'
import Loader from './components/Loader/Loader'
import Tickets from './pages/Tickets/Tickets'
import LoginForm from './components/LoginForm/LoginForm'

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PageRouter />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
