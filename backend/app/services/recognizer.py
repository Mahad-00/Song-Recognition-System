import numpy as np
from app.core.db import db


class SongMatcher:
    def __init__(self):
        self.songs = []
        self.avg_l2 = None
        self.avg_corr = None

    def load_all(self):
        cursor = db["songs"].find({}, {
            "_id": 1, "title": 1, "artist": 1,
            "album": 1, "genre": 1, "windows": 1
        })
        self.songs = []
        arr_list = []
        corr_list = []
        for doc in cursor:
            windows = doc.get("windows") or []
            raw = []
            for w in windows:
                vals = w.get("mfcc")
                if vals and len(vals) == 20:
                    raw.append(np.array(vals, dtype=np.float64))
            if len(raw) < 2:
                continue

            avg = np.mean(raw, axis=0)
            an = np.linalg.norm(avg)
            avg_l2 = avg / an if an > 0 else avg

            ac = avg_l2 - avg_l2.mean()
            acn = np.linalg.norm(ac)
            avg_corr = ac / acn if acn > 0 else ac

            arr_list.append(avg_l2)
            corr_list.append(avg_corr)

            self.songs.append({
                "_id": str(doc["_id"]),
                "title": doc.get("title", "Unknown"),
                "artist": doc.get("artist", "Unknown"),
                "album": doc.get("album", ""),
                "genre": doc.get("genre", ""),
            })

        self.avg_l2 = np.array(arr_list, dtype=np.float64)
        self.avg_corr = np.array(corr_list, dtype=np.float64)

    def count(self):
        return len(self.songs)

    def find_match(self, frames, top_n=5):
        if len(frames) == 0:
            return []

        f = np.array(frames, dtype=np.float64)
        if f.ndim == 1:
            f = f.reshape(1, -1)

        q_l2 = f / np.linalg.norm(f, axis=1, keepdims=True).clip(min=1e-10)

        c = f - f.mean(axis=1, keepdims=True)
        q_corr = c / np.linalg.norm(c, axis=1, keepdims=True).clip(min=1e-10)

        q_avg = q_l2.mean(axis=0)
        q_avg /= np.linalg.norm(q_avg).clip(min=1e-10)
        q_avg_c = q_avg - q_avg.mean()
        q_avg_c /= np.linalg.norm(q_avg_c).clip(min=1e-10)

        scores_l2 = np.dot(self.avg_l2, q_avg)
        scores_corr = np.dot(self.avg_corr, q_avg_c)
        scores = scores_l2 * 0.5 + scores_corr * 0.5

        top_idx = np.argpartition(scores, -top_n)[-top_n:]
        order = np.argsort(scores[top_idx])[::-1]
        top_idx = top_idx[order]

        result = []
        for i, idx in enumerate(top_idx):
            raw = float(scores[idx])
            if len(top_idx) > 1:
                next_raw = float(scores[top_idx[min(i + 1, len(top_idx) - 1)]])
                margin = raw - next_raw
                conf = min(100, max(0, 50 + margin * 500))
            else:
                conf = 50.0
            result.append((conf, self.songs[idx]))

        return result


matcher = SongMatcher()
