from fastapi import APIRouter, UploadFile, File, HTTPException
import numpy as np
import io
import soundfile as sf
import librosa
from services.recognizer import matcher

router = APIRouter(prefix="/identify", tags=["identify"])


@router.post("/")
async def identify(audio: UploadFile = File(...)):
    if matcher.count() == 0:
        raise HTTPException(status_code=503, detail="Song index not loaded yet")

    try:
        contents = await audio.read()

        # Load audio from uploaded bytes
        audio_data, sr = sf.read(io.BytesIO(contents))

        # Convert to mono if needed
        if len(audio_data.shape) > 1:
            audio_data = audio_data.mean(axis=1)

        # Resample to 22050 if needed (librosa default)
        if sr != 22050:
            audio_data = librosa.resample(y=audio_data, orig_sr=sr, target_sr=22050)
            sr = 22050

        # Extract 20 MFCC coefficients (matching stored features)
        mfcc = librosa.feature.mfcc(y=audio_data, sr=sr, n_mfcc=20, n_fft=2048, hop_length=512)
        avg_mfcc = np.mean(mfcc, axis=1)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Audio processing failed: {str(e)}")

    matches = matcher.find_match(avg_mfcc)

    if not matches or matches[0][0] < 30:
        return {"match": None, "message": "No matching song found"}

    confidence, song = matches[0]
    return {
        "match": {
            "title": song["title"],
            "artist": song["artist"],
            "album": song["album"],
            "genre": song["genre"],
            "confidence": round(confidence, 1),
        }
    }
