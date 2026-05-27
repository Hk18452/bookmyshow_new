from fastapi import APIRouter, HTTPException, Depends
from typing import List
from database import get_db
from models import BookingCreate, BookingOut
from auth import get_current_user

router = APIRouter()

@router.post("/bookings", response_model=BookingOut)
def create_booking(booking: BookingCreate, user_id: int = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()

    # Validate show exists
    show = cursor.execute("""
        SELECT s.*, m.title as movie_title, v.name as venue_name
        FROM shows s
        JOIN movies m ON s.movie_id = m.id
        JOIN venues v ON s.venue_id = v.id
        WHERE s.id = ?
    """, (booking.show_id,)).fetchone()
    if not show:
        conn.close()
        raise HTTPException(status_code=404, detail="Show not found")

    # Validate seats
    if not booking.seat_ids:
        conn.close()
        raise HTTPException(status_code=400, detail="No seats selected")

    placeholders = ",".join("?" * len(booking.seat_ids))
    seats = cursor.execute(
        f"SELECT * FROM seats WHERE id IN ({placeholders}) AND show_id = ?",
        (*booking.seat_ids, booking.show_id)
    ).fetchall()

    if len(seats) != len(booking.seat_ids):
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid seat selection")

    already_booked = [s for s in seats if s["is_booked"]]
    if already_booked:
        conn.close()
        raise HTTPException(status_code=400, detail="Some seats are already booked")

    total_amount = show["price"] * len(booking.seat_ids)

    # Create booking
    cursor.execute(
        "INSERT INTO bookings (user_id, show_id, total_amount) VALUES (?, ?, ?)",
        (user_id, booking.show_id, total_amount)
    )
    booking_id = cursor.lastrowid

    # Link seats to booking and mark as booked
    for seat_id in booking.seat_ids:
        cursor.execute("INSERT INTO booking_seats (booking_id, seat_id) VALUES (?, ?)", (booking_id, seat_id))
        cursor.execute("UPDATE seats SET is_booked = 1 WHERE id = ?", (seat_id,))

    conn.commit()

    # Fetch created booking
    seat_labels = [f"{s['row_label']}{s['seat_number']}" for s in seats]
    booking_row = cursor.execute("SELECT * FROM bookings WHERE id = ?", (booking_id,)).fetchone()
    conn.close()

    return {
        "id": booking_id,
        "show_id": booking.show_id,
        "movie_title": show["movie_title"],
        "venue_name": show["venue_name"],
        "show_time": show["show_time"],
        "seats": seat_labels,
        "total_amount": total_amount,
        "booking_date": booking_row["booking_date"],
        "status": "confirmed"
    }

@router.get("/bookings/my", response_model=List[BookingOut])
def my_bookings(user_id: int = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    bookings = cursor.execute("""
        SELECT b.id, b.show_id, m.title as movie_title, v.name as venue_name,
               s.show_time, b.total_amount, b.booking_date, b.status
        FROM bookings b
        JOIN shows s ON b.show_id = s.id
        JOIN movies m ON s.movie_id = m.id
        JOIN venues v ON s.venue_id = v.id
        WHERE b.user_id = ?
        ORDER BY b.booking_date DESC
    """, (user_id,)).fetchall()

    result = []
    for b in bookings:
        seats = cursor.execute("""
            SELECT se.row_label || se.seat_number as label
            FROM booking_seats bs
            JOIN seats se ON bs.seat_id = se.id
            WHERE bs.booking_id = ?
        """, (b["id"],)).fetchall()
        result.append({
            "id": b["id"],
            "show_id": b["show_id"],
            "movie_title": b["movie_title"],
            "venue_name": b["venue_name"],
            "show_time": b["show_time"],
            "seats": [s["label"] for s in seats],
            "total_amount": b["total_amount"],
            "booking_date": b["booking_date"],
            "status": b["status"]
        })
    conn.close()
    return result
