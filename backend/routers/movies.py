from fastapi import APIRouter, Query
from typing import Optional, List
from database import get_db
from models import MovieOut

router = APIRouter()

@router.get("/movies", response_model=List[MovieOut])
def list_movies(
    genre: Optional[str] = None,
    language: Optional[str] = None,
    search: Optional[str] = None
):
    conn = get_db()
    cursor = conn.cursor()
    query = "SELECT * FROM movies WHERE is_active = 1"
    params = []
    if genre:
        query += " AND genre = ?"
        params.append(genre)
    if language:
        query += " AND language = ?"
        params.append(language)
    if search:
        query += " AND title LIKE ?"
        params.append(f"%{search}%")
    movies = cursor.execute(query, params).fetchall()
    conn.close()
    return [dict(m) for m in movies]

@router.get("/movies/{movie_id}", response_model=MovieOut)
def get_movie(movie_id: int):
    conn = get_db()
    cursor = conn.cursor()
    movie = cursor.execute("SELECT * FROM movies WHERE id = ? AND is_active = 1", (movie_id,)).fetchone()
    conn.close()
    if not movie:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Movie not found")
    return dict(movie)

@router.get("/genres")
def get_genres():
    conn = get_db()
    cursor = conn.cursor()
    genres = cursor.execute("SELECT DISTINCT genre FROM movies WHERE is_active = 1").fetchall()
    conn.close()
    return [g["genre"] for g in genres]

@router.get("/languages")
def get_languages():
    conn = get_db()
    cursor = conn.cursor()
    langs = cursor.execute("SELECT DISTINCT language FROM movies WHERE is_active = 1").fetchall()
    conn.close()
    return [l["language"] for l in langs]
