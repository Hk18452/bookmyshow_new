import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMovies, getCities } from '../api'
import MovieCard from '../components/MovieCard'

export default function Home() {
    const [movies, setMovies] = useState([])
    const [cities, setCities] = useState([])
    const [selectedCity, setSelectedCity] = useState('')
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        Promise.all([getMovies(), getCities()])
            .then(([movRes, cityRes]) => {
                setMovies(movRes.data)
                setCities(cityRes.data)
            })
            .finally(() => setLoading(false))
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/movies?search=${search}`)
    }

    const featured = movies.slice(0, 6)
    const topRated = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 6)

    return (
        <div>
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="container hero-content">
                    <h1>Your Entertainment<br />Destination</h1>
                    <p>Book tickets for movies, events, plays and more — all in one place.</p>
                    <form className="hero-search" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search for movies, events..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Search</button>
                    </form>
                </div>
            </section>

            <div className="container">
                {/* City Filter */}
                {cities.length > 0 && (
                    <section className="section" style={{ paddingBottom: 0 }}>
                        <div className="city-pills">
                            <button
                                className={`city-pill ${selectedCity === '' ? 'active' : ''}`}
                                onClick={() => setSelectedCity('')}
                            >All Cities</button>
                            {cities.map(city => (
                                <button
                                    key={city}
                                    className={`city-pill ${selectedCity === city ? 'active' : ''}`}
                                    onClick={() => setSelectedCity(city)}
                                >{city}</button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Now Showing */}
                <section className="section">
                    <h2 className="section-title">Now Showing</h2>
                    {loading ? (
                        <div className="spinner" />
                    ) : (
                        <div className="movies-grid">
                            {featured.map(movie => (
                                <MovieCard key={movie.id} movie={movie} city={selectedCity} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Top Rated */}
                <section className="section">
                    <h2 className="section-title">Top Rated</h2>
                    {loading ? (
                        <div className="spinner" />
                    ) : (
                        <div className="movies-grid">
                            {topRated.map(movie => (
                                <MovieCard key={movie.id} movie={movie} city={selectedCity} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
