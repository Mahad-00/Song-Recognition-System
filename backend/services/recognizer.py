import numpy as np
from config.db import db


class SongMatcher:
    def __init__(self):
        self.songs = []

    def load_all(self):
        """Load all song features from MongoDB into memory once at startup."""
        cursor = db["songs"].find({}, {
            "_id": 1, "track_id": 1, "title": 1, "artist": 1,
            "album": 1, "genre": 1, "duration": 1, "windows": 1
        })
        self.songs = []
        for doc in cursor:
            windows = doc.get("windows") or []
            if not windows:
                continue

            mfcc_windows = []
            for w in windows:
                vals = w.get("mfcc")
                if vals and len(vals) == 20:
                    mfcc_windows.append(vals)

            if len(mfcc_windows) < 2:
                continue

            avg_mfcc = np.mean(mfcc_windows, axis=0)
            norm = np.linalg.norm(avg_mfcc)
            if norm > 0:
                avg_mfcc = avg_mfcc / norm

            self.songs.append({
                "_id": str(doc["_id"]),
                "track_id": doc.get("track_id"),
                "title": doc.get("title", "Unknown"),
                "artist": doc.get("artist", "Unknown"),
                "album": doc.get("album", ""),
                "genre": doc.get("genre", ""),
                "duration": doc.get("duration", 0),
                "avg_mfcc": avg_mfcc,
            })

    def count(self):
        return len(self.songs)

    def find_match(self, recorded_mfcc, top_n=5):
        """Find best matching song by cosine similarity."""
        rec_norm = np.linalg.norm(recorded_mfcc)
        if rec_norm > 0:
            recorded_mfcc = recorded_mfcc / rec_norm

        best = []
        for song in self.songs:
            sim = float(np.dot(recorded_mfcc, song["avg_mfcc"]))
            confidence = max(0, min(100, (sim + 1) * 50))
            best.append((confidence, song))

        best.sort(key=lambda x: x[0], reverse=True)
        return best[:top_n]


# Singleton
matcher = SongMatcher()
