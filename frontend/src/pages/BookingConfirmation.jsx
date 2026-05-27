import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function BookingConfirmation() {
    const location = useLocation()
    const navigate = useNavigate()
    //const booking = location.state?.booking
    const booking = location.state?.booking

    useEffect(() => {
        if (!booking) navigate('/')
    }, [booking])

    if (!booking) return null

    const formatDateTime = (dt) => {
        const d = new Date(dt)
        return d.toLocaleString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: 600, paddingTop: 60 }}>
                {/* Success Icon */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: '50%',
                        background: 'rgba(34,197,94,0.15)',
                        border: '2px solid var(--success)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', margin: '0 auto 20px'
                    }}>✅</div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>Booking Confirmed!</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
                        Your tickets have been booked successfully.
                    </p>
                </div>

                {/* Ticket Card */}
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    marginBottom: 24
                }}>
                    {/* Ticket Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--accent), #8b0000)',
                        padding: '20px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: 4 }}>BOOKING ID</div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>#{String(booking.id).padStart(6, '0')}</div>
                        </div>
                        <div style={{ fontSize: '2rem' }}>🎟️</div>
                    </div>

                    {/* Ticket Body */}
                    <div style={{ padding: '24px' }}>
                        <div className="summary-row">
                            <span className="summary-label">Movie</span>
                            <span className="summary-value">{booking.movie_title}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Venue</span>
                            <span className="summary-value">{booking.venue_name}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Show Time</span>
                            <span className="summary-value">{formatDateTime(booking.show_time)}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Seats</span>
                            <span className="summary-value">{booking.seats.join(', ')}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Status</span>
                            <span className="booking-status confirmed">{booking.status.toUpperCase()}</span>
                        </div>
                        <div className="summary-row" style={{ borderBottom: 'none', paddingTop: 16 }}>
                            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total Paid</span>
                            <span className="summary-total">₹{booking.total_amount}</span>
                        </div>
                    </div>

                    {/* Dashed Divider */}
                    <div style={{ borderTop: '2px dashed var(--border)', margin: '0 24px' }} />

                    {/* Barcode Placeholder */}
                    <div style={{ padding: '20px 24px', textAlign: 'center' }}>
                        <div style={{
                            background: 'repeating-linear-gradient(90deg, var(--text-primary) 0px, var(--text-primary) 2px, transparent 2px, transparent 6px)',
                            height: 50, borderRadius: 4, opacity: 0.15, marginBottom: 8
                        }} />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: 2 }}>
                            BMS{String(booking.id).padStart(10, '0')}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <Link to="/" className="btn btn-outline">Back to Home</Link>
                    <Link to="/profile" className="btn btn-primary">My Bookings</Link>
                </div>
            </div>
        </div>
    )
}
