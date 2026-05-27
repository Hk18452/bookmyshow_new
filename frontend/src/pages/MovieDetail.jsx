import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovie } from '../api'

export default function MovieDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMovie(id)
            .then(res => setMovie(res.data))
            .catch(() => navigate('/movies'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <div className="page"><div className="spinner" /></div>
    if (!movie) return null

    return (
        <div className="page">
            {/* Backdrop */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: 400,
                background: `linear-gradient(to bottom, rgba(0,0,0,0.7), var(--bg-primary))`,
                zIndex: 0
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 32 }}>
                <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                    {/* Poster */}
                    <div style={{ flexShrink: 0 }}>
                        <img
                            src={movie.poster_url || `https://via.placeholder.com/280x420/1a1a1a/cc0000?text=${encodeURIComponent(movie.title)}`}
                            alt={movie.title}
                            style={{ width: 260, borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow)' }}
                            onError={(e) => { e.target.src = `https://via.placeholder.com/280x420/1a1a1a/cc0000?text=${encodeURIComponent(movie.title)}` }}
                        />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 280 }}>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 12 }}>{movie.title}</h1>

                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                            <span className="badge" style={{ fontSize: '0.85rem', padding: '4px 12px' }}>⭐ {movie.rating}/10</span>
                            <span className="badge">{movie.genre}</span>
                            <span className="badge">{movie.language}</span>
                            <span className="badge">{movie.duration} min</span>
                        </div>

                        {movie.release_date && (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
                                Released: {new Date(movie.release_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        )}

                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32, maxWidth: 560 }}>
                            {movie.description}
                        </p>

                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate(`/movies/${id}/shows`)}
                        >
                            🎟️ Book Tickets
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
