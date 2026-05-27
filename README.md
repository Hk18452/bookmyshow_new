<<<<<<< HEAD
# BookMyShow Clone

A full-stack BookMyShow clone built with **React + Vite** (frontend) and **Python FastAPI + SQLite** (backend).

## Features
- 🎬 Browse movies with genre/language filters
- 🔍 Search movies
- 🏙️ Filter shows by city
- 🎭 Interactive seat selection map
- 🎟️ Book tickets with JWT authentication
- 👤 User profile & booking history

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, Axios |
| Backend | Python, FastAPI, SQLite, JWT |
| Styling | Vanilla CSS (dark theme) |

---

## Quick Start

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --port 8000
```

API runs at: http://localhost:8000  
Swagger docs: http://localhost:8000/docs

### 2. Frontend Setup

> **Requires Node.js** — [Download here](https://nodejs.org/)

```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173

---

## Demo Credentials
- **Email:** demo@bookmyshow.com  
- **Password:** demo123

---

## Project Structure

```
project/
├── backend/
│   ├── main.py          # FastAPI app
│   ├── database.py      # SQLite schema
│   ├── auth.py          # JWT auth
│   ├── models.py        # Pydantic models
│   ├── seed.py          # Sample data
│   └── routers/
│       ├── users.py
│       ├── movies.py
│       ├── shows.py
│       └── bookings.py
└── frontend/
    └── src/
        ├── pages/       # All page components
        ├── components/  # Reusable components
        ├── api/         # Axios API layer
        └── context/     # Auth context
```
=======
# bookmyshow_new
>>>>>>> 2f020ebe75500300eb92adc24677a9118a18f120
