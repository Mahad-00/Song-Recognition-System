from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from app.core.db import db

router = APIRouter(prefix="/favorites", tags=["favorites"])

favorites_coll = db["favorites"]


class AddFavoriteRequest(BaseModel):
    user_email: str
    title: str
    artist: str
    album: str = ""
    genre: str = ""
    confidence: float = 0


class RemoveFavoriteRequest(BaseModel):
    user_email: str
    title: str
    artist: str


@router.post("/")
async def add_favorite(body: AddFavoriteRequest):
    existing = favorites_coll.find_one({
        "user_email": body.user_email,
        "title": body.title,
        "artist": body.artist,
    })
    if existing:
        return {"message": "Already in favorites"}

    favorites_coll.insert_one({
        "user_email": body.user_email,
        "title": body.title,
        "artist": body.artist,
        "album": body.album,
        "genre": body.genre,
        "confidence": body.confidence,
        "created_at": datetime.now(timezone.utc),
    })
    return {"message": "Added to favorites"}


@router.get("/")
async def list_favorites(user_email: str = Query(...)):
    cursor = favorites_coll.find(
        {"user_email": user_email},
        sort=[("created_at", -1)],
    )
    items = []
    for doc in cursor:
        items.append({
            "title": doc["title"],
            "artist": doc["artist"],
            "album": doc.get("album", ""),
            "genre": doc.get("genre", ""),
            "confidence": doc.get("confidence", 0),
            "created_at": doc["created_at"].isoformat(),
        })
    return {"favorites": items}


@router.delete("/")
async def remove_favorite(body: RemoveFavoriteRequest):
    result = favorites_coll.delete_one({
        "user_email": body.user_email,
        "title": body.title,
        "artist": body.artist,
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"message": "Removed from favorites"}
