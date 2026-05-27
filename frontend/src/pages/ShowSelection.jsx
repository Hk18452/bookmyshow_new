import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getMovie, getShows, getCities } from '../api'

export default function ShowSelection() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [movie, setMovie] = useState(null)
    const [shows, setShows] = useState([])
    const [cities, setCities] = useState([])
    const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getMovie(id), getCities()])
            .then(([mRes, cRes]) => {
                setMovie(mRes.data)
                setCities(cRes.data)
            })
    }, [id])

    useEffect(() => {
        setLoading(true)
        const params = { movie_id: id }
        if (selectedCity) params.city = selectedCity
        getShows(params)
            .then(res => setShows(res.data))
            .finally(() => setLoading(false))
    }, [id, selectedCity])

    // Group shows by venue
    const grouped = shows.reduce((acc, show) => {
        const key = `${show.venue_name} - ${show.venue_city}`
        if (!acc[key]) acc[key] = []
        acc[key].push(show)
        return acc
    }, {})

    const formatTime = (dt) => {
        const d = new Date(dt)
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    }

    const formatDate = (dt) => {
        const d = new Date(dt)
        return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
    }

    return (
        <div className="page">
            <div className="container">
                <div style={{ marginBottom: 24 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back</button>
                </div>

                {movie && (
                    <div style={{ marginBottom: 32 }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{movie.title}</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                            {movie.language} • {movie.duration} min • ⭐ {movie.rating}
                        </p>
                    </div>
                )}

                {/* City Filter */}
                <div className="city-pills" style={{ marginBottom: 32 }}>
                    <button className={`city-pill ${selectedCity === '' ? 'active' : ''}`} onClick={() => setSelectedCity('')}>All Cities</button>
                    {cities.map(c => (
                        <button key={c} className={`city-pill ${selectedCity === c ? 'active' : ''}`} onClick={() => setSelectedCity(c)}>{c}</button>
                    ))}
                </div>

                {loading ? (
                    <div className="spinner" />
                ) : Object.keys(grouped).length === 0 ? (
                    <div className="empty-state">
                        <div className="icon">🎭</div>
                        <h3>No shows available</h3>
                        <p>Try selecting a different city</p>
                    </div>
                ) : (
                    Object.entries(grouped).map(([venue, venueShows]) => (
                        <div key={venue} style={{ marginBottom: 32 }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>
                                📍 {venue}
                            </h3>
                            <div className="shows-grid">
                                {venueShows.map(show => (
                                    <div
                                        key={show.id}
                                        className="show-card"
                                        onClick={() => navigate(`/shows/${show.id}/seats`)}
                                    >
                                        <div className="show-time">{formatTime(show.show_time)}</div>
                                        <div className="show-info">{formatDate(show.show_time)}</div>
                                        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem' }}>₹{show.price}</span>
                                            <span style={{ fontSize: '0.75rem', color: show.available_seats > 20 ? 'var(--success)' : 'var(--warning)' }}>
                                                {show.available_seats} left
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
