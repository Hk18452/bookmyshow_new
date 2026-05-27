import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getMyBookings } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
        getMyBookings()
            .then(res => setBookings(res.data))
            .finally(() => setLoading(false))
    }, [user])

    const handleLogout = () => {
        logoutUser()
        navigate('/')
    }

    const formatDateTime = (dt) => {
        const d = new Date(dt)
        return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    if (!user) return null

    return (
        <div className="page">
            <div className="container">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="avatar">{user.name[0].toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{user.name}</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{user.email}</p>
                        {user.phone && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 2 }}>📞 {user.phone}</p>}
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
                </div>

                {/* Booking History */}
                <h2 className="section-title">My Bookings</h2>

                {loading ? (
                    <div className="spinner" />
                ) : bookings.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">🎟️</div>
                        <h3>No bookings yet</h3>
                        <p>Start booking your favourite movies!</p>
                        <Link to="/movies" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Movies</Link>
                    </div>
                ) : (
                    bookings.map(booking => (
                        <div key={booking.id} className="booking-history-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                <div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>{booking.movie_title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>📍 {booking.venue_name}</p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 2 }}>🕐 {formatDateTime(booking.show_time)}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 6 }}>
                                        Seats: <strong style={{ color: 'var(--text-secondary)' }}>{booking.seats.join(', ')}</strong>
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>₹{booking.total_amount}</div>
                                    <span className={`booking-status ${booking.status}`}>{booking.status.toUpperCase()}</span>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
                                        #{String(booking.id).padStart(6, '0')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
