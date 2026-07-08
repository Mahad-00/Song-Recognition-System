from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.identify import router as identify_router
from services.recognizer import matcher

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


@app.on_event("startup")
def load_songs():
    matcher.load_all()
    print(f"Loaded {matcher.count()} songs into memory")


@app.get("/")
def root():
    return {"message": "EchoID API is running", "songs_loaded": matcher.count()}
