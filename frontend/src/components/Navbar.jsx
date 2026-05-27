import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = () => {
        logoutUser()
        navigate('/')
    }

    const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link'

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="nav-logo">
                    book<span>my</span>show
                </Link>

                <div className="nav-links">
                    <Link to="/" className={isActive('/')}>Home</Link>
                    <Link to="/movies" className={isActive('/movies')}>Movies</Link>
                </div>

                <div className="nav-user">
                    {user ? (
                        <>
                            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div className="nav-avatar">{user.name[0].toUpperCase()}</div>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user.name}</span>
                            </Link>
                            <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ marginLeft: 8 }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
