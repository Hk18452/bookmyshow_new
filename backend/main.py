from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import users, movies, shows, bookings

app = FastAPI(title="BookMyShow Clone API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

app.include_router(users.router, tags=["Auth & Users"])
app.include_router(movies.router, tags=["Movies"])
app.include_router(shows.router, tags=["Shows"])
app.include_router(bookings.router, tags=["Bookings"])

@app.get("/")
def root():
    return {"message": "BookMyShow Clone API is running!"}
