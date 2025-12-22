import './App.css'
import LoginForm from './components/LoginForm/LoginForm'
import Loader from './components/Loader/Loader'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Tickets from './pages/Tickets/Tickets'
import RootPage from './pages/RootPage/RootPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path="/tickets" element={<Tickets />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
