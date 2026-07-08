from fastapi import APIRouter, UploadFile, File, HTTPException
import numpy as np
import tempfile
import os
import subprocess
import librosa
from imageio_ffmpeg import get_ffmpeg_exe
from app.services.recognizer import matcher

router = APIRouter(prefix="/identify", tags=["identify"])


def convert_to_wav(input_path: str, output_path: str):
    ffmpeg = get_ffmpeg_exe()
    subprocess.run(
        [ffmpeg, "-y", "-i", input_path,
         "-acodec", "pcm_s16le", "-ac", "1",
         output_path],
        capture_output=True, check=True
    )


@router.post("/")
async def identify(audio: UploadFile = File(...)):
    if matcher.count() == 0:
        raise HTTPException(status_code=503, detail="Song index not loaded yet")

    try:
        contents = await audio.read()
        if len(contents) < 1024:
            raise HTTPException(status_code=400, detail="Audio file too small or empty")

        suffix = os.path.splitext(audio.filename or "audio.m4a")[1] or ".m4a"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        try:
            wav_path = tmp_path + "_converted.wav"
            convert_to_wav(tmp_path, wav_path)
            audio_data, sr = librosa.load(wav_path, sr=None, mono=True)
            os.unlink(wav_path)
        finally:
            os.unlink(tmp_path)

        audio_data, _ = librosa.effects.trim(audio_data, top_db=30)
        if len(audio_data) < 0.5 * sr:
            raise HTTPException(status_code=400, detail="Recording too short")
        peak = np.abs(audio_data).max()
        if peak > 0:
            audio_data = audio_data / peak * 0.95

        mfcc = librosa.feature.mfcc(y=audio_data, sr=sr, n_mfcc=20,
                                     n_fft=2048, hop_length=512).T

        matches = matcher.find_match(mfcc)

        if not matches or matches[0][0] < 30:
            return {"match": None, "message": "No matching song found"}

        result_matches = []
        for conf, song in matches[:3]:
            result_matches.append({
                "title": song["title"],
                "artist": song["artist"],
                "album": song["album"],
                "genre": song["genre"],
                "confidence": round(conf, 1),
            })

        return {"match": result_matches[0], "alternatives": result_matches[1:]}

    except subprocess.CalledProcessError as e:
        detail = e.stderr.decode(errors="ignore")[:200] if e.stderr else "ffmpeg conversion failed"
        raise HTTPException(status_code=400, detail=f"Audio conversion failed: {detail}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Audio processing failed: {str(e)}")
