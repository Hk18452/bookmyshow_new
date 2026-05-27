import { useNavigate } from 'react-router-dom'

export default function MovieCard({ movie, city }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/movies/${movie.id}`)
    }

    const handleBookNow = (e) => {
        e.stopPropagation()
        const params = city ? `?city=${city}` : ''
        navigate(`/movies/${movie.id}/shows${params}`)
    }

    return (
        <div className="card movie-card" onClick={handleClick}>
            <div className="poster-wrap">
                <img
                    src={movie.poster_url || `https://via.placeholder.com/300x450/1a1a1a/cc0000?text=${encodeURIComponent(movie.title)}`}
                    alt={movie.title}
                    onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x450/1a1a1a/cc0000?text=${encodeURIComponent(movie.title)}`
                    }}
                />
                <div className="poster-overlay">
                    <button className="btn btn-primary btn-sm" onClick={handleBookNow}>
                        Book Now
                    </button>
                </div>
            </div>
            <div className="card-body">
                <div className="card-title">{movie.title}</div>
                <div className="card-meta">
                    <span className="rating">⭐ ⭐⭐⭐{movie.rating}</span>
                    <span className="badge">{movie.genre}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {movie.language} • {movie.duration} min
                </div>
            </div>
        </div>
    )
}
