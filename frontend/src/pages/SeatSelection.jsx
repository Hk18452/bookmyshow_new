import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getShow, getSeats, createBooking } from '../api'
import { useAuth } from '../context/AuthContext'

export default function SeatSelection() {
    const { showId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [show, setShow] = useState(null)
    const [seats, setSeats] = useState([])
    const [selectedSeats, setSelectedSeats] = useState([])
    const [loading, setLoading] = useState(true)
    const [booking, setBooking] = useState(false)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        Promise.all([getShow(showId), getSeats(showId)])
            .then(([sRes, seatsRes]) => {
                setShow(sRes.data)
                setSeats(seatsRes.data)
            })
            .finally(() => setLoading(false))
    }, [showId])

    const showToast = (msg, type = 'error') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    const toggleSeat = (seat) => {
        if (seat.is_booked) return
        setSelectedSeats(prev =>
            prev.includes(seat.id)
                ? prev.filter(id => id !== seat.id)
                : [...prev, seat.id]
        )
    }

    const handleBook = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/shows/${showId}/seats` } })
            return
        }
        if (selectedSeats.length === 0) {
            showToast('Please select at least one seat')
            return
        }
        setBooking(true)
        try {
            const res = await createBooking({ show_id: parseInt(showId), seat_ids: selectedSeats })
            navigate('/booking/confirmation', { state: { booking: res.data } })
        } catch (err) {
            showToast(err.response?.data?.detail || 'Booking failed. Please try again.')
        } finally {
            setBooking(false)
        }
    }

    // Group seats by row
    const rows = seats.reduce((acc, seat) => {
        if (!acc[seat.row_label]) acc[seat.row_label] = []
        acc[seat.row_label].push(seat)
        return acc
    }, {})

    const getSeatClass = (seat) => {
        if (seat.is_booked) return 'seat booked'
        if (selectedSeats.includes(seat.id)) return 'seat selected'
        return 'seat available'
    }

    const totalAmount = show ? selectedSeats.length * show.price : 0

    const formatDateTime = (dt) => {
        const d = new Date(dt)
        return d.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    }

    if (loading) return <div className="page"><div className="spinner" /></div>

    return (
        <div className="page">
            <div className="container">
                <div style={{ marginBottom: 24 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back</button>
                </div>

                {show && (
                    <div style={{ marginBottom: 24 }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{show.venue_name}</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                            {formatDateTime(show.show_time)} • ₹{show.price}/seat
                        </p>
                    </div>
                )}

                {/* Screen */}
                <div className="screen-label">— SCREEN —</div>

                {/* Seat Legend */}
                <div className="seat-legend">
                    <div className="legend-item"><div className="seat-dot available" /><span>Available</span></div>
                    <div className="legend-item"><div className="seat-dot selected" /><span>Selected</span></div>
                    <div className="legend-item"><div className="seat-dot booked" /><span>Booked</span></div>
                </div>

                {/* Seat Map */}
                <div className="seat-map">
                    {Object.entries(rows).map(([rowLabel, rowSeats]) => (
                        <div key={rowLabel} className="seat-row">
                            <span className="row-label">{rowLabel}</span>
                            {rowSeats.map((seat, idx) => (
                                <>
                                    {idx === 5 && <div key="aisle" className="seat-aisle" />}
                                    <button
                                        key={seat.id}
                                        className={getSeatClass(seat)}
                                        onClick={() => toggleSeat(seat)}
                                        title={`${rowLabel}${seat.seat_number}`}
                                    >
                                        {seat.seat_number}
                                    </button>
                                </>
                            ))}
                            <span className="row-label">{rowLabel}</span>
                        </div>
                    ))}
                </div>

                {/* Booking Bar */}
                {selectedSeats.length > 0 && (
                    <div style={{
                        position: 'fixed', bottom: 0, left: 0, right: 0,
                        background: 'var(--bg-elevated)',
                        borderTop: '1px solid var(--border)',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 100,
                        backdropFilter: 'blur(12px)'
                    }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                                {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} • ₹{totalAmount}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {selectedSeats.length} × ₹{show?.price}
                            </div>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={handleBook}
                            disabled={booking}
                        >
                            {booking ? 'Processing...' : 'Proceed to Pay'}
                        </button>
                    </div>
                )}
            </div>

            {toast && (
                <div className={`toast ${toast.type}`}>{toast.msg}</div>
            )}
        </div>
    )
}
