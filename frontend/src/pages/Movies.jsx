import { useState, useEffect } from 'react'
import { getMovies, getGenres, getLanguages } from '../api'
import MovieCard from '../components/MovieCard'
import { useSearchParams } from 'react-router-dom'

export default function Movies() {
    const [movies, setMovies] = useState([])
    const [genres, setGenres] = useState([])
    const [languages, setLanguages] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedGenre, setSelectedGenre] = useState('')
    const [selectedLang, setSelectedLang] = useState('')
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('search') || ''

    useEffect(() => {
        Promise.all([getGenres(), getLanguages()]).then(([g, l]) => {
            setGenres(g.data)
            setLanguages(l.data)
        })
    }, [])

    useEffect(() => {
        setLoading(true)
        const params = {}
        if (selectedGenre) params.genre = selectedGenre
        if (selectedLang) params.language = selectedLang
        if (searchQuery) params.search = searchQuery
        getMovies(params)
            .then(res => setMovies(res.data))
            .finally(() => setLoading(false))
    }, [selectedGenre, selectedLang, searchQuery])

    return (
        <div className="page">
            <div className="container">
                <section className="section">
                    <h1 className="section-title">
                        {searchQuery ? `Results for "${searchQuery}"` : 'All Movies'}
                    </h1>

                    {/* Genre Filter */}
                    <div className="filter-bar">
                        <button
                            className={`filter-tag ${selectedGenre === '' ? 'active' : ''}`}
                            onClick={() => setSelectedGenre('')}
                        >All Genres</button>
                        {genres.map(g => (
                            <button
                                key={g}
                                className={`filter-tag ${selectedGenre === g ? 'active' : ''}`}
                                onClick={() => setSelectedGenre(g)}
                            >{g}</button>
                        ))}
                    </div>

                    {/* Language Filter */}
                    <div className="filter-bar">
                        <button
                            className={`filter-tag ${selectedLang === '' ? 'active' : ''}`}
                            onClick={() => setSelectedLang('')}
                        >All Languages</button>
                        {languages.map(l => (
                            <button
                                key={l}
                                className={`filter-tag ${selectedLang === l ? 'active' : ''}`}
                                onClick={() => setSelectedLang(l)}
                            >{l}</button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="spinner" />
                    ) : movies.length === 0 ? (
                        <div className="empty-state">
                            <div className="icon">🎬</div>
                            <h3>No movies found</h3>
                            <p>Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="movies-grid">
                            {movies.map(movie => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
