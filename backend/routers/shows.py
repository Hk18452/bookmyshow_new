from fastapi import APIRouter, HTTPException
from typing import Optional, List
from database import get_db
from models import ShowOut, SeatOut

router = APIRouter()

@router.get("/shows", response_model=List[ShowOut])
def list_shows(movie_id: Optional[int] = None, city: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    query = """
        SELECT s.id, s.movie_id, s.venue_id, v.name as venue_name, v.city as venue_city,
               s.show_time, s.total_seats, s.price,
               (s.total_seats - COUNT(CASE WHEN se.is_booked = 1 THEN 1 END)) as available_seats
        FROM shows s
        JOIN venues v ON s.venue_id = v.id
        LEFT JOIN seats se ON se.show_id = s.id
        WHERE 1=1
    """
    params = []
    if movie_id:
        query += " AND s.movie_id = ?"
        params.append(movie_id)
    if city:
        query += " AND v.city = ?"
        params.append(city)
    query += " GROUP BY s.id ORDER BY s.show_time"
    shows = cursor.execute(query, params).fetchall()
    conn.close()
    return [dict(s) for s in shows]

@router.get("/shows/{show_id}", response_model=ShowOut)
def get_show(show_id: int):
    conn = get_db()
    cursor = conn.cursor()
    show = cursor.execute("""
        SELECT s.id, s.movie_id, s.venue_id, v.name as venue_name, v.city as venue_city,
               s.show_time, s.total_seats, s.price,
               (s.total_seats - COUNT(CASE WHEN se.is_booked = 1 THEN 1 END)) as available_seats
        FROM shows s
        JOIN venues v ON s.venue_id = v.id
        LEFT JOIN seats se ON se.show_id = s.id
        WHERE s.id = ?
        GROUP BY s.id
    """, (show_id,)).fetchone()
    conn.close()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    return dict(show)

@router.get("/shows/{show_id}/seats", response_model=List[SeatOut])
def get_seats(show_id: int):
    conn = get_db()
    cursor = conn.cursor()
    seats = cursor.execute(
        "SELECT id, seat_number, row_label, is_booked FROM seats WHERE show_id = ? ORDER BY row_label, seat_number",
        (show_id,)
    ).fetchall()
    conn.close()
    return [{"id": s["id"], "seat_number": s["seat_number"], "row_label": s["row_label"], "is_booked": bool(s["is_booked"])} for s in seats]

@router.get("/cities")
def get_cities():
    conn = get_db()
    cursor = conn.cursor()
    cities = cursor.execute("SELECT DISTINCT city FROM venues").fetchall()
    conn.close()
    return [c["city"] for c in cities]
