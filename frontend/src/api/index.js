import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000',
})

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Movies
export const getMovies = (params) => api.get('/movies', { params })
export const getMovie = (id) => api.get(`/movies/${id}`)
export const getGenres = () => api.get('/genres')
export const getLanguages = () => api.get('/languages')

// Shows
export const getShows = (params) => api.get('/shows', { params })
export const getShow = (id) => api.get(`/shows/${id}`)
export const getSeats = (showId) => api.get(`/shows/${showId}/seats`)
export const getCities = () => api.get('/cities')

// Bookings
export const createBooking = (data) => api.post('/bookings', data)
export const getMyBookings = () => api.get('/bookings/my')

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/users/me')

export default api
