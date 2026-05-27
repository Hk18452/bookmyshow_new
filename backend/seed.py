import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import get_db, init_db
from auth import get_password_hash

def seed():
    init_db()
    conn = get_db()
    cursor = conn.cursor()

    # Check if already seeded
    existing = cursor.execute("SELECT COUNT(*) as cnt FROM movies").fetchone()
    if existing["cnt"] > 0:
        print("Database already seeded!")
        conn.close()
        return

    # Seed movies
    movies = [
        ("Kalki 2898 AD", "Sci-Fi", "Telugu", 181, 8.3, "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg", "A mythological sci-fi epic set in the year 2898 AD.", "2024-06-27"),
        ("Pushpa 2: The Rule", "Action", "Telugu", 190, 8.0, "https://image.tmdb.org/t/p/w500/ie7A4RHJJFqmOHFiVJHkXFNzJnX.jpg", "Pushpa Raj continues his rise in the red sandalwood smuggling world.", "2024-12-05"),
        ("Stree 2", "Horror Comedy", "Hindi", 135, 8.5, "https://image.tmdb.org/t/p/w500/38OEder6ZqHEFHkCLAEBFMbMSEe.jpg", "The legend of Stree returns to haunt Chanderi once more.", "2024-08-15"),
        ("Devara", "Action", "Telugu", 166, 7.2, "https://image.tmdb.org/t/p/w500/iiEKBjMpCBEBFCHHDSqFMfPHMGr.jpg", "A fearless man and his son battle the most dreaded gangsters.", "2024-09-27"),
        ("Singham Returns", "Action", "Hindi", 148, 6.8, "https://image.tmdb.org/t/p/w500/oBIQDKcqNxKckjugtmzpIIOgoc4.jpg", "Singham returns to fight corruption and crime.", "2024-08-15"),
        ("Vettaiyan", "Action", "Tamil", 170, 7.5, "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggkl.jpg", "A veteran cop hunts down a serial killer terrorizing society.", "2024-10-10"),
        ("Amaran", "Drama", "Tamil", 167, 8.7, "https://image.tmdb.org/t/p/w500/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg", "A biographical war drama about Major Mukund Varadarajan.", "2024-10-31"),
        ("Bhool Bhulaiyaa 3", "Horror Comedy", "Hindi", 144, 7.1, "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggkl.jpg", "Rooh Baba returns in another spooky adventure.", "2024-11-01"),
        ("The Sabarmati Report", "Drama", "Hindi", 130, 7.8, "https://image.tmdb.org/t/p/w500/oBIQDKcqNxKckjugtmzpIIOgoc4.jpg", "A journalist uncovers the truth behind a tragic train incident.", "2024-11-15"),
        ("Lucky Baskhar", "Thriller", "Telugu", 148, 8.1, "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg", "A bank employee gets entangled in a money laundering scheme.", "2024-10-31"),
    ]
    cursor.executemany(
        "INSERT INTO movies (title, genre, language, duration, rating, poster_url, description, release_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        movies
    )

    # Seed venues
    venues = [
        ("PVR Cinemas - Phoenix Mall", "Chennai", "Phoenix Market City, Velachery"),
        ("INOX - Forum Mall", "Bangalore", "Forum Mall, Koramangala"),
        ("Cinepolis - VR Mall", "Chennai", "VR Mall, Anna Nagar"),
        ("PVR - Nexus Mall", "Hyderabad", "Nexus Mall, Kukatpally"),
        ("INOX - GVK One", "Hyderabad", "GVK One Mall, Banjara Hills"),
    ]
    cursor.executemany("INSERT INTO venues (name, city, address) VALUES (?, ?, ?)", venues)

    conn.commit()

    # Seed shows
    import datetime
    today = datetime.date.today()
    show_times = ["10:00", "13:30", "17:00", "20:30"]
    prices = [180, 220, 250, 300]

    for movie_id in range(1, 11):
        for venue_id in range(1, 6):
            for day_offset in range(3):
                date = today + datetime.timedelta(days=day_offset)
                for i, time in enumerate(show_times):
                    show_datetime = f"{date} {time}:00"
                    price = prices[i % len(prices)]
                    cursor.execute(
                        "INSERT INTO shows (movie_id, venue_id, show_time, total_seats, price) VALUES (?, ?, ?, ?, ?)",
                        (movie_id, venue_id, show_datetime, 80, price)
                    )

    conn.commit()

    # Seed seats for each show
    show_ids = cursor.execute("SELECT id FROM shows").fetchall()
    rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
    seats_per_row = 10

    for show in show_ids:
        show_id = show["id"]
        for row in rows:
            for seat_num in range(1, seats_per_row + 1):
                cursor.execute(
                    "INSERT INTO seats (show_id, seat_number, row_label) VALUES (?, ?, ?)",
                    (show_id, str(seat_num), row)
                )

    conn.commit()

    # Seed a demo user
    cursor.execute(
        "INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)",
        ("Demo User", "demo@bookmyshow.com", get_password_hash("demo123"), "9876543210")
    )
    conn.commit()
    conn.close()
    print("✅ Database seeded successfully!")
    print("Demo user: demo@bookmyshow.com / demo123")

if __name__ == "__main__":
    seed()
