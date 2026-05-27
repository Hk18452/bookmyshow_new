import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "bookmyshow.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            phone TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            genre TEXT NOT NULL,
            language TEXT NOT NULL,
            duration INTEGER NOT NULL,
            rating REAL DEFAULT 0,
            poster_url TEXT,
            description TEXT,
            release_date TEXT,
            is_active INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS venues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            city TEXT NOT NULL,
            address TEXT
        );

        CREATE TABLE IF NOT EXISTS shows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            movie_id INTEGER NOT NULL,
            venue_id INTEGER NOT NULL,
            show_time TEXT NOT NULL,
            total_seats INTEGER DEFAULT 100,
            price REAL NOT NULL,
            FOREIGN KEY (movie_id) REFERENCES movies(id),
            FOREIGN KEY (venue_id) REFERENCES venues(id)
        );

        CREATE TABLE IF NOT EXISTS seats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            show_id INTEGER NOT NULL,
            seat_number TEXT NOT NULL,
            row_label TEXT NOT NULL,
            is_booked INTEGER DEFAULT 0,
            FOREIGN KEY (show_id) REFERENCES shows(id)
        );

        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            show_id INTEGER NOT NULL,
            total_amount REAL NOT NULL,
            booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'confirmed',
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (show_id) REFERENCES shows(id)
        );

        CREATE TABLE IF NOT EXISTS booking_seats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            booking_id INTEGER NOT NULL,
            seat_id INTEGER NOT NULL,
            FOREIGN KEY (booking_id) REFERENCES bookings(id),
            FOREIGN KEY (seat_id) REFERENCES seats(id)
        );
    """)
    conn.commit()
    conn.close()
