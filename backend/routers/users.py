from fastapi import APIRouter, HTTPException, Depends, status
from database import get_db
from models import UserRegister, UserLogin, Token, UserOut
from auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter()

@router.post("/auth/register", response_model=UserOut)
def register(user: UserRegister):
    conn = get_db()
    cursor = conn.cursor()
    existing = cursor.execute("SELECT id FROM users WHERE email = ?", (user.email,)).fetchone()
    if existing:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = get_password_hash(user.password)
    cursor.execute(
        "INSERT INTO users (name, email, password_hash, phone) VALUES (?, ?, ?, ?)",
        (user.name, user.email, hashed, user.phone)
    )
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    return {"id": user_id, "name": user.name, "email": user.email, "phone": user.phone}

@router.post("/auth/login", response_model=Token)
def login(user: UserLogin):
    conn = get_db()
    cursor = conn.cursor()
    db_user = cursor.execute("SELECT * FROM users WHERE email = ?", (user.email,)).fetchone()
    conn.close()
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": str(db_user["id"])})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/users/me", response_model=UserOut)
def get_me(user_id: int = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    user = cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return dict(user)
