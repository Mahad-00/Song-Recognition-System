from datetime import datetime, timezone
from fastapi import APIRouter, Query
from pydantic import BaseModel
from app.core.db import db

router = APIRouter(tags=["search"])

songs_coll = db["songs"]
history_coll = db["history"]


@router.get("/search/")
async def search_songs(q: str = Query(..., min_length=1)):
    if len(q) < 1:
        return {"results": []}
    regex = {"$regex": q, "$options": "i"}
    cursor = songs_coll.find(
        {
            "$or": [
                {"title": regex},
                {"artist": regex},
                {"album": regex},
                {"genre": regex},
            ]
        },
        {"_id": 0, "track_id": 1, "title": 1, "artist": 1,
         "album": 1, "genre": 1, "duration": 1},
    ).limit(20)
    return {"results": list(cursor)}


class SaveHistoryRequest(BaseModel):
    user_email: str
    query: str


@router.post("/history/")
async def save_history(body: SaveHistoryRequest):
    history_coll.insert_one({
        "user_email": body.user_email,
        "query": body.query,
        "created_at": datetime.now(timezone.utc),
    })
    return {"message": "Saved"}


@router.get("/history/")
async def get_history(user_email: str = Query(...)):
    cursor = history_coll.find(
        {"user_email": user_email},
        sort=[("created_at", -1)],
        limit=20,
    )
    items = []
    for doc in cursor:
        items.append({
            "query": doc["query"],
            "created_at": doc["created_at"].isoformat(),
        })
    return {"history": items}
