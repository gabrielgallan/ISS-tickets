import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "./Layout.css"

function TicketsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
      <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480q0 17 11.5 28.5T480-440Zm0-160q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm320 440H160q-33 0-56.5-23.5T80-240v-160q33 0 56.5-23.5T160-480q0-33-23.5-56.5T80-560v-160q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v160q-33 0-56.5 23.5T800-480q0 33 23.5 56.5T880-400v160q0 33-23.5 56.5T800-160Zm0-80v-102q-37-22-58.5-58.5T720-480q0-43 21.5-79.5T800-618v-102H160v102q37 22 58.5 58.5T240-480q0 43-21.5 79.5T160-342v102h640ZM480-480Z"/>
    </svg>
  )
}

function CollapseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
      <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
    </svg>
  )
}

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="app-shell" data-collapsed={collapsed ? "true" : "false"}>
      <aside className="sidebar">
        <div className="sidebar__brand">
          <img
            className="brand__logo"
            src={collapsed ? "/iss-favicon.ico" : "/biglogo.svg"}
            alt="ISS"
          />
        </div>

        <nav className="nav" aria-label="Navegação">
          <Link to="/tickets" data-active={location.pathname === "/tickets" ? "true" : "false"}>
            <span className="nav__icon" aria-hidden="true"><TicketsIcon /></span>
            <span className="nav__label">Tickets</span>
          </Link>
        </nav>

        <button
          type="button"
          className="sidebar__toggle"
          aria-label={collapsed ? "Expandir navegação" : "Retrair navegação"}
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <span className="sidebar__toggle-icon"><CollapseIcon /></span>
          <span className="sidebar__toggle-label">{collapsed ? "Expandir" : "Retrair"}</span>
        </button>
      </aside>

      <main className="content">
        <div className="page">
          {children}
        </div>
      </main>
    </div>
  )
}
