from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]

# Movies
class MovieOut(BaseModel):
    id: int
    title: str
    genre: str
    language: str
    duration: int
    rating: float
    poster_url: Optional[str]
    description: Optional[str]
    release_date: Optional[str]

# Venues
class VenueOut(BaseModel):
    id: int
    name: str
    city: str
    address: Optional[str]

# Shows
class ShowOut(BaseModel):
    id: int
    movie_id: int
    venue_id: int
    venue_name: str
    venue_city: str
    show_time: str
    total_seats: int
    available_seats: int
    price: float

# Seats
class SeatOut(BaseModel):
    id: int
    seat_number: str
    row_label: str
    is_booked: bool

# Bookings
class BookingCreate(BaseModel):
    show_id: int
    seat_ids: List[int]

class BookingOut(BaseModel):
    id: int
    show_id: int
    movie_title: str
    venue_name: str
    show_time: str
    seats: List[str]
    total_amount: float
    booking_date: str
    status: str
