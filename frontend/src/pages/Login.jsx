import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { login } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const navigate = useNavigate()
    const location = useLocation()
    const { loginUser } = useAuth()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const from = location.state?.from || '/'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await login(form)
            const token = res.data.access_token
            // Get user info
            const { getMe } = await import('../api')
            localStorage.setItem('token', token)
            const userRes = await getMe()
            loginUser(token, userRes.data)
            navigate(from, { replace: true })
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed. Check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <h1>bookmyshow</h1>
                    <p>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: 16, padding: '10px 14px', background: 'rgba(204,0,0,0.1)', borderRadius: 'var(--radius-sm)' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: 16, padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Demo: <strong style={{ color: 'var(--text-secondary)' }}>demo@bookmyshow.com</strong> / <strong style={{ color: 'var(--text-secondary)' }}>demo123</strong>
                </div>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    )
}
