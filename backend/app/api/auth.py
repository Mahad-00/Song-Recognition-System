from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
import bcrypt as _bcrypt
from app.core.db import users_collection
from app.models.user import SignupRequest, LoginRequest, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserOut)
async def signup(body: SignupRequest):
    existing = users_collection.find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    hashed_password = _bcrypt.hashpw(body.password.encode("utf-8"), _bcrypt.gensalt()).decode("utf-8")
    now = datetime.now(timezone.utc)

    user_doc = {
        "full_name": body.full_name,
        "email": body.email,
        "hashed_password": hashed_password,
        "created_at": now,
    }

    result = users_collection.insert_one(user_doc)
    created = users_collection.find_one({"_id": result.inserted_id})

    return UserOut(
        id=str(created["_id"]),
        full_name=created["full_name"],
        email=created["email"],
        created_at=created["created_at"],
    )


@router.post("/login", response_model=UserOut)
async def login(body: LoginRequest):
    user = users_collection.find_one({"email": body.email.strip().lower()})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not _bcrypt.checkpw(body.password.encode("utf-8"), user["hashed_password"].encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return UserOut(
        id=str(user["_id"]),
        full_name=user["full_name"],
        email=user["email"],
        created_at=user["created_at"],
    )
