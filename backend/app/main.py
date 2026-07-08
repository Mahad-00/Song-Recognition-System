from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.identify import router as identify_router
from app.api.favorites import router as favorites_router
from app.api.search import router as search_router
from app.services.recognizer import matcher

app = FastAPI(title="EchoID API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(identify_router)
app.include_router(favorites_router)
app.include_router(search_router)


@app.on_event("startup")
def load_songs():
    matcher.load_all()
    print(f"Loaded {matcher.count()} songs into memory")


@app.get("/")
def root():
    return {"message": "EchoID API is running", "songs_loaded": matcher.count()}
