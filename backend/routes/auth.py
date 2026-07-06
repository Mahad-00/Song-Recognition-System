from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
import bcrypt as _bcrypt
from config.db import users_collection
from models.user import SignupRequest, UserOut

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
